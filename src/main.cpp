#include "../include/Vuelo.hpp"

int main(){
    Aeropuerto a1("BOG", "El Dorado", "Bogotá", "Colombia");
    Aeropuerto a2("MON", "Los Garzones", "Montería", "Colombia");
    
    Vuelo vuelo1(&a1, &a2, 350000.0f, 1.2f, 0);

    vuelo1.mostrarInformacion();

    return 0;
}
