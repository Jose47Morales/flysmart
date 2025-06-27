#include <iostream>
#include <string>
#include "GrafoDeRutas.hpp"
#include "Dijkstra.hpp"

using namespace std;

void mostrarMenuBusqueda(GrafoDeRutas& grafo){
    string origen, destino;
    int opcionCriterio;

    cout << "=== FlySmart - Búsqueda de Ruta de Vuelo ===\n\n";
    cout << "Aeropuertos disponibles:\n";
    grafo.mostrarAeropuertosDisponibles();

    cout << "\nIngrese el código del aeropuerto de ORIGEN: ";
    cin >> origen;

    cout << "Ingrese el código del aeropuerto de DESTINO: ";
    cin >> destino;

    cout << "\nSeleccione el criterio de optimización:\n";
    cout << "1. Precio\n";
    cout << "2. Escalas\n";
    cout << "3. Duración (no implementado aún)\n";
    cout << "Opción: ";
    cin >> opcionCriterio;

    string criterio;
    switch (opcionCriterio)
    {
    case 1: criterio = "precio"; break;
    case 2: criterio = "escalas"; break;
    case 3: criterio = "duracion"; break;
    default:
        cout << "Criterio inválido.\n";
        return;
    }

    cout << "\n Buscando la mejor ruta...\n\n";
    Dijkstra::encontrarRutaMasCorta(grafo, origen, destino, criterio);
}
