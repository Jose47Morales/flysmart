#include <iostream>
#include <fstream>
#ifdef _WIN32
#include <windows.h>
#endif
#include "../include/json.hpp"
#include "../include/GrafoDeRutas.hpp"
#include "../include/Dijkstra.hpp"

using json = nlohmann::json;
using namespace std;

int main(int argc, char* argv[]){
    #ifdef _WIN32
    SetConsoleOutputCP(CP_UTF8);
    #endif
    if (argc != 5){
        cerr << R"({"error": "Uso: ./flysmart <origen> <destino> <criterio> <archivo_json>"})" << endl;
        return 1;
    }

    string origen = argv[1];
    string destino = argv[2];
    string criterio = argv[3];
    string archivo = argv[4];

    ifstream file(archivo);
    if (!file.is_open()) {
        std::cerr << R"({"error": "No se pudo abrir el archivo de datos"})" << endl;
        return 1;
    }

    GrafoDeRutas grafo;
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
        string o = v["origen"];
        string d = v["destino"];
        float precio = v["precio"];
        float duracion = v["duracion"];
        int escalas = v["escalas"];
        grafo.agregarVuelo(Vuelo(
            mapaAeropuertos[o],
            mapaAeropuertos[d],
            precio, duracion, escalas
        ));
    }
    
    Dijkstra::encontrarRutaComoJSON(grafo, origen, destino, criterio);
    
    return 0;
}
