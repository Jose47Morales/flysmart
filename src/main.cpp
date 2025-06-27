#include <iostream>
#include <fstream>
#include "../include/json.hpp"
#include "../include/GrafoDeRutas.hpp"
#include "../include/Dijkstra.hpp"

using json = nlohmann::json;
using namespace std;

void cargarDatos(GrafoDeRutas& grafo, const string& rutaArchivo) {
    ifstream file(rutaArchivo);
    if (!file.is_open()){
        cerr << "Error al abrir el archivo de vuelos_demo.json\n";
        exit(1);
    }

    json data;
    file >> data;

    unordered_map<string, Aeropuerto*> mapaAeropuertos;

    for (const auto& a : data["aeropuertos"]) {
        string cod = a["codigo"];
        auto* aeropuerto = new Aeropuerto(cod, a["nombre"], a["ciudad"], a["pais"]);
        mapaAeropuertos[cod] = aeropuerto;
        grafo.agregarAeropuerto(aeropuerto);
    }

    for (const auto& v : data["vuelos"]){
        string origen = v["origen"];
        string destino = v["destino"];
        float precio = v["precio"];
        float duracion = v["duracion"];
        int escalas = v["escalas"];

        auto* a_origen = mapaAeropuertos[origen];
        auto* a_destino = mapaAeropuertos[destino];

        grafo.agregarVuelo(Vuelo(a_origen, a_destino, precio, duracion, escalas));
    }
}

void mostrarMenu(GrafoDeRutas& grafo) {
    string origen, destino, criterio;

    grafo.mostrarAeropuertosDisponibles();

    cout << "\nAeropuerto origen (IATA): ";
    cin >> origen;

    cout << "Aeropuerto destino (IATA): ";
    cin >> destino;

    cout << "\nCriterio de búsqueda:\n";
    cout << " 1. Precio\n";
    cout << " 2. Duración\n";
    cout << " 3. Escalas\n";
    cout << "Seleccione una opción (1-3): ";
    
    int opcion;
    cin >> opcion;

    switch (opcion){
        case 1: criterio = "precio"; break;
        case 2: criterio = "duracion"; break;
        case 3: criterio = "escalas"; break;
        default:
            cout << "Opción invalida\n";
            return;
    }

    Dijkstra::encontrarRutaMasCorta(grafo, origen, destino, criterio);
}

int main(){
    GrafoDeRutas grafo;

    cargarDatos(grafo, "data/vuelos_demo.json");

    char repetir;
    do {
        mostrarMenu(grafo);
        cout << "\n¿Deseas buscar otra ruta? (s/n): ";
        cin >> repetir;
    } while (tolower(repetir) == 's');

    cout << "\nGracias por usar FlySmart\n";
    
    return 0;
}
