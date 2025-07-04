from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/buscar', methods=['POST'])
def buscar_ruta():
    data = request.json
    origen = data.get('origen')
    destino = data.get('destino')
    criterio = data.get('criterio')

    exe_path = os.path.abspath("flysmart.exe")
    json_path = os.path.abspath("data/vuelos_demo.json")

    try: 
        result = subprocess.run(
            [exe_path, origen, destino, criterio, json_path],
            capture_output=True, text=True, encoding="utf-8"
        )

        resultado = json.loads(result.stdout)
        return jsonify(resultado)
    
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Error al ejecutar el algoritmo", "detalle": e.stderr}), 500
    except json.JSONDecodeError:
        return jsonify({"error": "La salida del ejecutable no es un JSON válido", "detalle": result.stdout}), 500

if __name__ == '__main__':
    app.run(debug=True)