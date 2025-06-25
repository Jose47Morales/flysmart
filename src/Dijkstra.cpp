#include "../include/Dijkstra.hpp"
#include <queue>
#include <unordered_map>
#include <climits>
#include <iostream>

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
    if (criterio == "durecion") return vuelo.getDuracion();
    if (criterio == "escalas") return static_cast<float>(vuelo.getEscalas());
    return vuelo.getPrecio();
}

void Dijkstra::encontrarRutaMasCorta(
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
            std::cout << "Ruta más óptima según [" << criterio << "]:\n";
            for (const auto& cod : actual.ruta) {
                std::cout << cod << " -> ";
            }
            std::cout << "FIN\n";
            
            if (criterio == "escalas"){
                std::cout << "Total escalas: " << actual.ruta.size() - 1 << "\n";
            } else if (criterio == "duracion") {
                std::cout << "Total duración: " << actual.costoAcumulado << " horas\n";
            } else {
                std::cout << "Total precio: $" << actual.costoAcumulado << "\n";
            }

            return;
        }

        for (const auto& vuelo : grafo.obtenerVuelosDesde(actual.codigo)) {
            std::string vecino = vuelo.getDestino()->getCodigoIATA();
            float peso = obtenerValorCriterio(vuelo, criterio);
            float nuevCosto = actual.costoAcumulado + peso;

            if (dist.find(vecino) == dist.end() || nuevCosto < dist[vecino]) {
                dist[vecino] = nuevCosto;
                predecesor[vecino] = actual.codigo;
                std::vector<std::string> nuevaRuta = actual.ruta;
                nuevaRuta.push_back(vecino);
                pq.push({vecino, nuevCosto, nuevaRuta});
            }
        }
    }

    std::cout << "No se encontró una ruta de " << origen << " a " << destino << "\n";
}