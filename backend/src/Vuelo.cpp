#include "../include/Vuelo.hpp"
#include <iostream>

Vuelo::Vuelo(const Aeropuerto* origen, const Aeropuerto* destino, float precio, float duracion, int escalas)
    : origen(origen), destino(destino), precio(precio), duracion(duracion), escalas(escalas) {}

const Aeropuerto* Vuelo::getOrigen() const{
    return origen;
}

const Aeropuerto* Vuelo::getDestino() const{
    return destino;
}

float Vuelo::getPrecio() const{
    return precio;
}

float Vuelo::getDuracion() const{
    return duracion;
}

int Vuelo::getEscalas() const{
    return escalas;
}

void Vuelo::mostrarInformacion() const{
    std::cout << "Vuelo de " << origen->getCodigoIATA() <<" a " << destino->getCodigoIATA() << " | Precio: $" << precio
                                                                                            << " | Duración: " << duracion
                                                                                            << " | Escalas: " << escalas << std::endl;
}
