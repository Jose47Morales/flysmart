#include "../include/Dijkstra.hpp"
#include <queue>
#include <unordered_map>
#include <climits>
#include <iostream>

using json = nlohmann::json;

struct NodoRuta {
    std::string codigo;
    float costoAcumulado;
    std::vector<std::string> ruta;

    bool operator>(const NodoRuta& otro) const {
        return costoAcumulado > otro.costoAcumulado;
    }
};

float obtenerValorCriterio(const Vuelo& vuelo, const std::string& criterio) {
    if (criterio == "precio") return vuelo.getPrecio();
    if (criterio == "duracion") return vuelo.getDuracion();
    if (criterio == "escalas") return static_cast<float>(vuelo.getEscalas());
    return vuelo.getPrecio();
}

json Dijkstra::encontrarRutaComoJSON(
    const GrafoDeRutas& grafo,
    const std::string& origen,
    const std::string& destino,
    const std::string& criterio
) {
    std::priority_queue<NodoRuta, std::vector<NodoRuta>, std::greater<NodoRuta>> pq;
    std::unordered_map<std::string, float> dist;
    std::unordered_map<std::string, std::string> predecesor;

    pq.push({origen, 0, {origen}});
    dist[origen] = 0;

    while (!pq.empty()) {
        NodoRuta actual = pq.top();
        pq.pop();

        if (actual.codigo == destino) {
            json resultado;
            resultado["ruta"] = actual.ruta;

            if (criterio == "escalas"){
                resultado["escalas"] = actual.ruta.size() - 2;
            } else if (criterio == "duracion") {
                resultado["duracion"] = actual.costoAcumulado;
            } else {
                resultado["precio"] = actual.costoAcumulado;
            }

            std::cout << resultado.dump();
            return;
        }

        for (const auto& vuelo : grafo.obtenerVuelosDesde(actual.codigo)) {
            std::string vecino = vuelo.getDestino()->getCodigoIATA();
            float peso = obtenerValorCriterio(vuelo, criterio);
            float nuevCosto = actual.costoAcumulado + peso;

            if (!dist.count(vecino) || nuevCosto < dist.at(vecino)) {
                dist[vecino] = nuevCosto;
                predecesor[vecino] = actual.codigo;
                std::vector<std::string> nuevaRuta = actual.ruta;
                nuevaRuta.push_back(vecino);
                pq.push({vecino, nuevCosto, nuevaRuta});
            }
        }
    }

    json error;
    error["error"] = "No se encontró una ruta desde " + origen + " hasta " + destino + " según el criterio: " + criterio;
    std::cout << error.dump();
}