#include <iostream>
#include <fstream>
#include "../include/json.hpp"
#include "../include/GrafoDeRutas.hpp"
#include "../include/Dijkstra.hpp"

using json = nlohmann::json;
using namespace std;

int main(){
    GrafoDeRutas grafo;

    ifstream file("data/vuelos_demo.json");
    if (!file.is_open()){
        cerr << "Error al abrir el archivo de vuelos_demo.json\n";
        return 1;
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

    grafo.mostrarRedDeRutas();

    string origen, destino, criterio;
    cout << "\nAeropuerto origen (IATA): ";
    cin >> origen;
    cout << "Aeropuerto destino (IATA): ";
    cin >> destino;
    cout << "Criterio (precio, duracion, escalas): ";
    cin >> criterio;

    Dijkstra::encontrarRutaMasCorta(grafo, origen, destino, criterio);

    return 0;
}
