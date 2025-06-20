#ifndef AEROPUERTO_HPP
#define AEROPUERTO_HPP

#include <string>

class Aeropuerto{
    private:
        std::string codigoIATA;
        std::string nombre;
        std::string ciudad;
        std::string pais;
    
    public:
        //Método constructor
        Aeropuerto(const std::string& codigoIATA, const std::string& nombre, const std::string& ciudad, const std::string& pais);

        //Getters
        std::string getCodigoIATA() const;
        std::string getNombre() const;
        std::string getCiudad() const;
        std::string getPais() const;

        void mostrarInformacion() const;
};

#endif
