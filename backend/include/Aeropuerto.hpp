#ifndef AEROPUERTO_HPP
#define AEROPUERTO_HPP

#include <string>

/**
 * @class Aeropuerto
 * @brief Representa un aeropuerto con su información básica.
 */
class Aeropuerto{
    private:
        std::string codigoIATA;
        std::string nombre;
        std::string ciudad;
        std::string pais;
    
    public:
        /**
         * @brief Constructor de la clase Aeropuerto.
         * @param codigoIATA Código IATA del aeropuerto.
         * @param nombre Nombre del aeropuerto.
         * @param ciudad Ciudad donde se encuentra.
         * @param pais País donde se enuentra.
         */
        Aeropuerto(const std::string& codigoIATA, const std::string& nombre, const std::string& ciudad, const std::string& pais);

        /// @return Código IATA del aeropuerto.
        std::string getCodigoIATA() const;

        /// @return Nopmbre del aeropuerto. 
        std::string getNombre() const;

        /// @return Ciudad del aeropuerto. 
        std::string getCiudad() const;

        /// @return País del aeropuerto. 
        std::string getPais() const;

        void mostrarInformacion() const;
};

#endif
