from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from serpapi import GoogleSearch
from datetime import datetime
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import json, os, subprocess


app = Flask(__name__, static_folder='static')
CORS(app)
load_dotenv()

API_KEY = os.environ.get('API_KEY')
CACHE_FILE = "../data/vuelos_cache.json"
geolocator = Nominatim(user_agent="flysmart-app")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

def obtener_coordenadas(ciudad, pais):
    try:
        location = geocode(f"{ciudad}, {pais}")
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"[WARN] No se pudo obtener coordenadas de {ciudad}, {pais}: {e}")
    return None, None

def cargar_live_data():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {"aeropuertos": [], "vuelos": []}
    else:
        return {"aeropuertos": [], "vuelos": []}
    
def guardar_live_data(data):
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[ERROR] No se pudo guardar vuelos_cache.json: {e}")

def actualizar_cache(grafo_json):
    cache_existente = cargar_live_data()

    aeropuertos_existentes = {a["codigo"] for a in cache_existente.get("aeropuertos", [])}
    for a in grafo_json["aeropuertos"]:
        if a["codigo"] not in aeropuertos_existentes:
            lat, lon = obtener_coordenadas(a["ciudad"], a["pais"])
            a["lat"] = lat
            a["lon"] = lon
            cache_existente["aeropuertos"].append(a)
            aeropuertos_existentes.add(a["codigo"])
            
    vuelos_existentes = {(v["origen"], v["destino"]) for v in cache_existente.get("vuelos", [])}
    for v in grafo_json["vuelos"]:
        clave = (v["origen"], v["destino"])
        if clave not in vuelos_existentes:
            cache_existente["vuelos"].append(v)
            vuelos_existentes.add(clave)
            
    guardar_live_data(cache_existente)

def obtener_vuelos(origen, destino, fecha):
    params = {
        "api_key": API_KEY,
        "engine": "google_flights",
        "departure_id": origen,
        "arrival_id": destino,
        "outbound_date": fecha,
        "currency": "COP",
        "type": "2"
    }
    search = GoogleSearch(params)
    resp = search.get_dict()

    if "error" in resp.get("search_metadata", {}):
        raise RuntimeError(resp["search_metadata"]["error"])
    
    return resp.get("best_flights", []) + resp.get("other_flights", []), resp.get("airports", []) 

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/aeropuertos", methods=["GET"])
def obtener_aeropuertos():
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return jsonify({"aeropuertos": data.get("aeropuertos", [])})
    except Exception as e:
        return jsonify({
            "error": "No se pudo cargar la lista de aeropuertos", 
            "detalles": str(e)
            }), 500

@app.route('/buscar', methods=['POST'])
def buscar():
    try:
        req = request.json
        origen = req.get('origen')
        destino = req.get('destino')
        criterio = req.get('criterio')
        fecha = req.get("fecha") or datetime.today().strftime("%Y-%m-%d")

        exe_path = os.path.abspath("bin/flysmart")

        if not origen or not destino or not criterio:
            return jsonify({"error": "Faltan parámetros"}), 400

        if origen == destino:
            return jsonify({"error": "El aeropuerto de origen y destino no pueden ser iguales"}), 400

        try:
            vuelos, aeropuertos = obtener_vuelos(origen, destino, fecha)

            if not vuelos or not aeropuertos:
                return jsonify({"error": "No se encontraron vuelos o aeropuertos reales"}), 404

            airports_meta = {}
            for grupo in aeropuertos:
                for tipo in ["departure", "arrival"]:
                    for a in grupo.get(tipo, []):
                        id_ = a["airport"]["id"]
                        airports_meta[id_] = {
                            "codigo": id_,
                            "nombre": a["airport"]["name"],
                            "ciudad": a.get("city", "Desconocido"),
                            "pais": a.get("country", "Desconocido")
                        }

            grafo_json = {
                "aeropuertos": [],
                "vuelos": []
            }
            seen = set()

            for f in vuelos:
                dep = f["flights"][0]["departure_airport"]["id"]
                arr = f["flights"][-1]["arrival_airport"]["id"]

                if dep not in seen and dep in airports_meta:
                    grafo_json["aeropuertos"].append(airports_meta[dep])
                    seen.add(dep)
                
                if arr not in seen and arr in airports_meta:
                    grafo_json["aeropuertos"].append(airports_meta[arr])
                    seen.add(arr)
                
                dur = sum([leg.get("duration", 0) for leg in f["flights"]]) / 60.0
                escalas = len(f["flights"]) - 1
                precio = f.get("price", 0)

                grafo_json["vuelos"].append({
                    "origen": dep, 
                    "destino": arr,
                    "precio": precio, 
                    "duracion": dur, 
                    "escalas": escalas
                })

            actualizar_cache(grafo_json)
        
        except Exception as e:
            print(f"[ERROR] SerpApi falló: {e}")
            grafo_json = cargar_live_data()

        result = subprocess.run( 
            [exe_path, origen, destino, criterio, CACHE_FILE], 
            capture_output=True, 
            text=True, 
            encoding="utf-8", 
            check=False
        )

        if result.returncode != 0:
            return jsonify({
                "error": "Error al ejecutar el motor de rutas", 
                "detalles": result.stderr.strip()
                }), 500
        
        respuesta_motor = json.loads(result.stdout)
        grafo_actualizado = cargar_live_data()
        aeropuertos_map = {a["codigo"]: a for a in grafo_actualizado.get("aeropuertos", [])}
        codigos_ruta = [nodo.get("codigo") for nodo in respuesta_motor.get("ruta", [])]

        for nodo in respuesta_motor.get("ruta", []):
            codigo = nodo.get("codigo")
            if codigo in aeropuertos_map:
                nodo["lat"] = aeropuertos_map[codigo]["lat"]
                nodo["lon"] = aeropuertos_map[codigo]["lon"]

        aeropuertos_usados = [aeropuertos_map[codigo] for codigo in codigos_ruta if codigo in aeropuertos_map]

        for a in aeropuertos_usados:
            if 'lat' not in a or 'lon' not in a:
                lat, lon = obtener_coordenadas(a['ciudad'], a['pais'])
                a['lat'] = lat
                a['lon'] = lon

        return jsonify({
            "ruta": respuesta_motor,
            "aeropuertos": aeropuertos_usados
        })
    
    except Exception as e:
        return jsonify({
            "error": "Error inesperado", 
            "detalles": str(e)
        }), 500

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
