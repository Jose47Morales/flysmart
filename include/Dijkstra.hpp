#ifndef DIJKSTRA_HPP
#define DIJKSTRA_HPP

#include "GrafoDeRutas.hpp"
#include <string>
#include <vector>

/**
 * @class Dijkstra
 * @brief Implementación del algoritmo de Dijkstra para encontrar rutas óptimas.
 */
class Dijkstra {
    public:
        /**
         * @brief Encuentra y muestra la ruta más corta entre dos aeropuertos según un criterio.
         * @param grafo La red de rutas (grafo).
         * @param origen Código IATA del aeropuerto de origen.
         * @param destino Código IATA del aeropuerto de destino.
         * @param citerio Criterio de optimización: "precio", "duracion", "escalas".
         */
        static void encontrarRutaMasCorta(
            const GrafoDeRutas& grafo,
            const std::string& origen,
            const std::string& destino,
            const std::string& criterio = "precio"
        );
};

#endif