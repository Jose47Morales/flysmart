#include "../include/GrafoDeRutas.hpp"

int main(){
    GrafoDeRutas grafo;

    auto* bog = new Aeropuerto("BOG", "El Dorado", "Bogotá", "Colombia");
    auto* mon = new Aeropuerto("MON", "Los Garzones", "Montería", "Colombia");
    auto* mde = new Aeropuerto("MDE", "José María Córdova", "Medellín", "Colombia");
    
    grafo.agregarAeropuerto(bog);
    grafo.agregarAeropuerto(mon);
    grafo.agregarAeropuerto(mde);

    grafo.agregarVuelo(Vuelo(bog, mde, 350000.0f, 1.2f, 0));
    grafo.agregarVuelo(Vuelo(mde, mon, 250000.0f, 1.0f, 0));
    grafo.agregarVuelo(Vuelo(bog, mon, 400000.0f, 1.5f, 1));

    grafo.mostrarRedDeRutas();

    return 0;
}
