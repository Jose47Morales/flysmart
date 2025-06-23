#include "../include/Dijkstra.hpp"

int main(){
    GrafoDeRutas grafo;

    auto* bog = new Aeropuerto("BOG", "El Dorado", "Bogotá", "Colombia");
    auto* mon = new Aeropuerto("MON", "Los Garzones", "Montería", "Colombia");
    auto* mde = new Aeropuerto("MDE", "José María Córdova", "Medellín", "Colombia");
    auto* ctg = new Aeropuerto("CTG", "Rafael Núñez", "Cartagena", "Colombia");

    grafo.agregarAeropuerto(bog);
    grafo.agregarAeropuerto(mon);
    grafo.agregarAeropuerto(mde);
    grafo.agregarAeropuerto(ctg);

    grafo.agregarVuelo(Vuelo(bog, mde, 350000.0f, 1.2f, 0));
    grafo.agregarVuelo(Vuelo(mde, ctg, 200000.0f, 1.0f, 0));
    grafo.agregarVuelo(Vuelo(bog, ctg, 500000.0f, 1.5f, 1));
    grafo.agregarVuelo(Vuelo(mde, mon, 250000.0f, 1.0f, 0));
    grafo.agregarVuelo(Vuelo(ctg, mon, 150000.0f, 0.8f, 0));

    grafo.mostrarRedDeRutas();

    Dijkstra::encontrarRutaMasCorta(grafo, "BOG", "MON", "precio");

    return 0;
}
