#include "../include/GrafoDeRutas.hpp"
#include <iostream>

GrafoDeRutas::~GrafoDeRutas() {
    for (auto& par : aeropuertos) {
        delete par.second;
    }
}

void GrafoDeRutas::agregarAeropuerto(Aeropuerto* aeropuerto){
    aeropuertos[aeropuerto->getCodigoIATA()] = aeropuerto;
}

void GrafoDeRutas::agregarVuelo(const Vuelo& vuelo){
    std::string origen = vuelo.getOrigen()->getCodigoIATA();
    rutas[origen].push_back(vuelo);
}

Aeropuerto* GrafoDeRutas::obtenerAeropuerto(const std::string& codigoIATA) const {
    auto it = aeropuertos.find(codigoIATA);
    return (it != aeropuertos.end()) ? it->second : nullptr;
}

std::vector<Vuelo> GrafoDeRutas::obtenerVuelosDesde(const std::string& codigoIATA) const {
    auto it = rutas.find(codigoIATA);
    return (it != rutas.end()) ? it->second : std::vector<Vuelo>();
}

void GrafoDeRutas::mostrarRedDeRutas() const {
    std::cout << "\nRed de vuelos disponibles:\n";
    for (const auto& par : rutas) {
        std::cout << "Desde " << par.first << ":\n";
        for (const auto& vuelo : par.second) {
            vuelo.mostrarInformacion();
        }
        std::cout << std::endl;
    }
}
