#ifndef DIJKSTRA_HPP
#define DIJKSTRA_HPP

#include "GrafoDeRutas.hpp"
#include <string>
#include <vector>

class Dijkstra {
    public:
        static void encontrarRutaMasCorta(
            const GrafoDeRutas& grafo,
            const std::string& origen,
            const std::string& destino,
            const std::string& criterio = "precio"
        );
};

#endif