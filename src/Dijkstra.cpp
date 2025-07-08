#include "../include/Dijkstra.hpp"
#include <queue>
#include <unordered_map>
#include <climits>
#include <iostream>
#include <cmath>
#include <set>

using json = nlohmann::json;

struct NodoRuta {
    std::string codigo;
    float costoAcumulado;
    std::vector<std::string> ruta;
    float precioTotal;
    float duracionTotal;
    int escalasTotal;

    bool operator>(const NodoRuta& otro) const {
        return costoAcumulado > otro.costoAcumulado;
    }
};

float obtenerValorCriterio(const Vuelo& vuelo, const std::string& criterio) {
    if (criterio == "precio") return vuelo.getPrecio();
    if (criterio == "duracion") return vuelo.getDuracion();
    if (criterio == "escalas") return 1.0f;
    return vuelo.getPrecio();
}

json Dijkstra::encontrarRutaComoJSON(
    const GrafoDeRutas& grafo,
    const std::string& origen,
    const std::string& destino,
    const std::string& criterio
) {
    if (origen == destino) {
        return json{{"error", "El aeropuerto de origen y destino no pueden ser iguales"}};
    }

    const std::set<std::string> criteriosValidos = {"precio", "duracion", "escalas"};
    if (criteriosValidos.find(criterio) == criteriosValidos.end()) {
        return json{{"error", "Criterio inválido. Usa 'precio', 'duracion' o 'escalas'"}};
    }

    std::priority_queue<NodoRuta, std::vector<NodoRuta>, std::greater<NodoRuta>> pq;
    std::unordered_map<std::string, float> dist;

    pq.push({origen, 0, {origen}, 0, 0, 0});
    dist[origen] = 0;

    while (!pq.empty()) {
        NodoRuta actual = pq.top();
        pq.pop();

        if (actual.codigo == destino) {
            json resultado;
            resultado["precio"] = actual.precioTotal;
            resultado["duracion"] = std::round(actual.duracionTotal * 100) / 100.0;
            resultado["escalas"] = actual.ruta.size() - 2;

            json rutaExpandida = json::array();
            for (const std::string& cod : actual.ruta) {
                Aeropuerto* a = grafo.obtenerAeropuerto(cod);
                if (a) {
                    rutaExpandida.push_back({
                        {"codigo", a->getCodigoIATA()},
                        {"nombre", a->getNombre()},
                        {"ciudad", a->getCiudad()},
                        {"pais", a->getPais()},
                    });
                }
            }

            resultado["ruta"] = rutaExpandida;
            return resultado;
        }

        for (const auto& vuelo : grafo.obtenerVuelosDesde(actual.codigo)) {
            std::string vecino = vuelo.getDestino()->getCodigoIATA();
            float peso = obtenerValorCriterio(vuelo, criterio);
            float nuevCosto = actual.costoAcumulado + peso;

            if (!dist.count(vecino) || nuevCosto < dist[vecino]) {
                dist[vecino] = nuevCosto;

                std::vector<std::string> nuevaRuta = actual.ruta;
                nuevaRuta.push_back(vecino);

                pq.push({
                    vecino, 
                    nuevCosto, 
                    nuevaRuta,
                    actual.precioTotal + vuelo.getPrecio(),
                    actual.duracionTotal + vuelo.getDuracion(),
                    actual.escalasTotal + vuelo.getEscalas(),
                });
            }
        }
    }

    return json{
        {"error", "No se encontró una ruta desde " + origen + " hasta " + destino + " según el criterio: " + criterio}
    };
}