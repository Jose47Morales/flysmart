#include "../include/Aeropuerto.hpp"

int main(){
    Aeropuerto a1("BOG", "El Dorado", "Bogotá", "Colombia");
    Aeropuerto a2("MON", "Los Garzones", "Montería", "Colombia");
    
    a1.mostrarInformacion();
    a2.mostrarInformacion();

    return 0;
}
