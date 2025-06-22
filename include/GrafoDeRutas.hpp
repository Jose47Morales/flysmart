#ifndef GRAFODERUTAS_HPP
#define GRAFODERUTAS_HPP

#include <vector>
#include <map>
#include <string>
#include "Aeropuerto.hpp"
#include "Vuelo.hpp"

class GrafoDeRutas {
    private:
        std::map<std::string, Aeropuerto*> aeropuertos;  // Código IATA -> Aeropuerto
        std::map<std::string, std::vector<Vuelo>> rutas; // Código IATA -> Lista de vuelos

    public:
        ~GrafoDeRutas();

        void agregarAeropuerto(Aeropuerto* aeropuerto);
        void agregarVuelo(const Vuelo& vuelo);

        Aeropuerto* obtenerAeropuerto(const std::string& codigoIATA) const;
        std::vector<Vuelo> obtenerVuelosDesde(const std::string& codigoIATA) const;

        void mostrarRedDeRutas() const;
};

#endif

