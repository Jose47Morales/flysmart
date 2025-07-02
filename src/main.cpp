#include <iostream>
#include <fstream>
#include <cstdlib>
#include "../include/json.hpp"
#include "../include/GrafoDeRutas.hpp"
#include "../include/Dijkstra.hpp"

using json = nlohmann::json;
using namespace std;

int main(int argc, char* argv[]){
    if (argc < 5){
        cerr << R"({"error": "Uso incorrecto. Ejemplo: ./flysmart BOG MDE precio"})" << endl;
        return 1;
    }

    string origen = argv[1];
    string destino = argv[2];
    string criterio = argv[3];

    GrafoDeRutas grafo;

    ifstream file(argv[4]);
    if (!file.is_open()) {
        std::cerr << R"({"error": "No se pudo abrir el archivo de datos"})" << endl;
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

    for (const auto& v : data["vuelos"]) {
        string orig = v["origen"];
        string dest = v["destino"];
        float precio = v["precio"];
        float duracion = v["duracion"];
        int escalas = v["escalas"];

        grafo.agregarVuelo(Vuelo(
            mapaAeropuertos[orig],
            mapaAeropuertos[dest],
            precio, duracion, escalas
        ));
    }

    json resultado = Dijkstra::encontrarRutaComoJSON(grafo, origen, destino, criterio);
    cout << resultado.dump(4) << endl;
    
    return 0;
}
