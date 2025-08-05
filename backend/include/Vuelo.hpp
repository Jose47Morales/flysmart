#ifndef VUELO_HPP
#define VUELO_HPP

#include <string>
#include "Aeropuerto.hpp"

/**
 * @class Vuelo
 * @brief Representa un vuelo entre dos aeropuertos con atributos clave.
 */
class Vuelo{
    private:
        const Aeropuerto* origen;
        const Aeropuerto* destino;
        float precio;
        float duracion;
        int escalas;
    
    public:
        /**
         * @brief Constructor del vuelo.
         * @param origen Aeropuerto de origen.
         * @param destino Aeropuerto de destino.
         * @param precio Precio del vuelo.
         * @param duracion Duración estimada.
         * @param escalas Número de escalas.
         */
        Vuelo(const Aeropuerto* origen, const Aeropuerto* destino, float precio, float duracion, int escalas);

        /// @return Aeropuerto de origen. 
        const Aeropuerto* getOrigen() const;

        /// @return Aeropuerto de destino.
        const Aeropuerto* getDestino() const;

        /// @return Precio del vuelo. 
        float getPrecio() const;

        /// @return Duración del vuelo en horas. 
        float getDuracion() const;

        /// @return Número de escalas. 
        int getEscalas() const;
        
        void mostrarInformacion() const;
};

#endif
