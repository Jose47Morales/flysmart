const myGlobe = Globe()
    (document.getElementById('globo'))
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .pointAltitude(0.05)
        .arcStroke(0.5)
        .arcColor(() => '#0a9396')
        .arcDashLength(0.4)
        .arcDashGap(2)
        .arcDashInitialGap(() => Math.random() * 5)
        .arcDashAnimateTime(1000);

const controls = myGlobe.controls();
controls.autoRotate = true;
controls.autoRotateSpeed = 0.1

async function cargarDatosGlobo(){
    const res = await fetch('http://localhost:5000/api/aeropuertos');
    const { aeropuertos } = await res.json();

    const puntos = aeropuertos.map(a => ({
        lat: a.lat || 0,
        lng: a.lon || 0,
        size: 0.6,
        label: `${a.codigo} - ${a.ciudad}`
    }));

    myGlobe.pointsData(puntos);
}

cargarDatosGlobo();

async function buscarRuta() {
  try {
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const criterio = document.getElementById("criterio").value;
    const fecha = document.getElementById("fecha").value;
    const mensajeError = document.getElementById("mensaje-error");
    const resultado = document.getElementById("resultado");
    const loader = document.getElementById("loader");

    mensajeError.style.display = "none";
    resultado.innerHTML = "";

    loader.style.display = "block";

    if (!origen || !destino || origen === destino) {
      mensajeError.textContent =
        "Por favor, ingresa aeropuertos válidos y diferentes.";
      mensajeError.style.display = "block";
      loader.style.display = "none";
      return;
    }

    if (!["precio", "duracion", "escalas"].includes(criterio)) {
      mensajeError.textContent = "Selecciona un criterio válido.";
      mensajeError.style.display = "block";
      loader.style.display = "none";
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:5000/buscar", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ origen, destino, criterio, fecha }),
      });

      const textoPlano = await respuesta.text();

      let datos;

      try {
        datos = JSON.parse(textoPlano);
      } catch (e) {
        console.error("[ERROR] No se pudo parsear JSON:", e);
        alert("La respuesta del servidor no es válida.");
        return;
      }

      const divResultado = document.getElementById("resultado");
      divResultado.innerHTML = "";

      loader.style.display = "none";

      try {
        const { ruta: rutaData, aeropuertos = [] } = datos;
        const {ruta, precio, duracion, escalas} = rutaData;

        if (!ruta || ruta.length < 2) {
          divResultado.innerHTML = `<div class="alert alert-danger">Ruta no encontrada, intenta con otra fecha y verifica los codigos IATA.</div>`;
          return;
        }

        let contenido = `<div class="card-ruta">
                            <h3>Ruta óptima encontrada</h3>
                            <p><span class="etiqueta">Origen:</span> ${ruta[0]["codigo"]} - ${ruta[0]["ciudad"]}, ${ruta[0]["pais"]}</p>
                            <p><span class="etiqueta">Destino:</span> ${ruta[ruta.length - 1]["codigo"]} - ${ruta[ruta.length - 1]["ciudad"]}, ${ruta[ruta.length - 1]["pais"]}</p>
                            <p><span class="etiqueta">Precio:</span> $${precio?.toLocaleString()}</p>
                            <p><span class="etiqueta">Duración:</span> ${duracion} horas</p>
                            <p><span class="etiqueta">Escalas:</span> ${escalas}</p>
                          </div>
                            `;

        divResultado.innerHTML = contenido;

        const mapaAeropuertos = Object.fromEntries(
          aeropuertos.map(a => [a.codigo, a])
        );

        console.log("Mapa de aeropuertos:", mapaAeropuertos);
        console.log("Ruta devuelta:", ruta);

        const arcos = [];

        for (let i = 0; i < ruta.length - 1; i++) {
          const origen = mapaAeropuertos[ruta[i].codigo];
          const destino = mapaAeropuertos[ruta[i + 1].codigo];

          if (!origen?.lat || !origen?.lon || destino?.lat || !destino?.lon) {
            console.warn(`Coordenadas faltantes para ${ruta[i].codigo} o ${ruta[i+1].codigo}`)
            continue;
          }

          arcos.push({
            startLat: origen.lat,
            startLng: origen.lon,
            endLat: destino.lat,
            endLng: destino.lon,
            color: 'orange'
          });
        }

        myGlobe.arcsData([]);
        myGlobe.arcsData(arcos);

      } catch (e) {
        console.error("[ERROR] Al procesar los datos:", e);
        divResultado.innerHTML = `<div class="alert alert-danger">${datos.error}</div>`;
      }
    } catch (e) {
      console.error("[ERROR] Falló el fetch:", e);
      loader.style.display = "none";
      mensajeError.textContent = "No se pudo conectar con el servidor.";
      mensajeError.style.display = "block";
    }
  } catch (err) {
    console.error(" [ERROR CATCH GLOBAL buscarRuta()]", err);
    alert("Se capturó una excepción fatal: " + err.message);
  }
}
