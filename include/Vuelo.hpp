#ifndef VUELO_HPP
#define VUELO_HPP

#include <string>
#include "Aeropuerto.hpp"

class Vuelo{
    private:
        const Aeropuerto* origen;
        const Aeropuerto* destino;
        float precio;
        float duracion;
        int escalas;
    
    public:
        //Método constructor
        Vuelo(const Aeropuerto* origen, const Aeropuerto* destino, float precio, float duracion, int escalas);

        //Getters
        const Aeropuerto* getOrigen() const;
        const Aeropuerto* getDestino() const;
        float getPrecio() const;
        float getDuracion() const;
        int getEscalas() const;
        
        void mostrarInformacion() const;
};

#endif
