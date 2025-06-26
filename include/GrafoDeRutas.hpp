#ifndef GRAFODERUTAS_HPP
#define GRAFODERUTAS_HPP

#include <vector>
#include <map>
#include <string>
#include "Aeropuerto.hpp"
#include "Vuelo.hpp"


/**
 * @class GrafoDeRutas
 * @brief Representa la red de vuelos como un grafo dirigido.
 */
class GrafoDeRutas {
    private:
        std::map<std::string, Aeropuerto*> aeropuertos;  // Código IATA -> Aeropuerto
        std::map<std::string, std::vector<Vuelo>> rutas; // Código IATA -> Lista de vuelos

    public:
        ~GrafoDeRutas();

        /// Agrega un aeropuerto a la red. 
        void agregarAeropuerto(Aeropuerto* aeropuerto);

        /// Agrega un vuelo entre dos aeropuertos. 
        void agregarVuelo(const Vuelo& vuelo);

        /// @return Puntero al aeropuerto dado su código.
        Aeropuerto* obtenerAeropuerto(const std::string& codigoIATA) const;
 
        /// @return Lista de vuelos desde un aeropuerto.
        std::vector<Vuelo> obtenerVuelosDesde(const std::string& codigoIATA) const;

        /// Muestra la red de rutas por consola.
        void mostrarRedDeRutas() const;
};

#endif

