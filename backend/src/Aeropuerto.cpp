#include "../include/Aeropuerto.hpp"
#include <iostream>

Aeropuerto::Aeropuerto(const std::string& codigoIATA, const std::string& nombre, const std::string& ciudad, const std::string& pais)
    : codigoIATA(codigoIATA), nombre(nombre), ciudad(ciudad), pais(pais) {}

std::string Aeropuerto::getCodigoIATA() const{
    return codigoIATA;
}

std::string Aeropuerto::getNombre() const{
    return nombre;
}

std::string Aeropuerto::getCiudad() const{
    return ciudad;
}

std::string Aeropuerto::getPais() const{
    return pais;
}

void Aeropuerto::mostrarInformacion() const{
    std::cout << "Aeropuerto " << nombre << " (" << codigoIATA << "), "
              << ciudad << ", " << pais << std::endl;
}
