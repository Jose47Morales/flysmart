document.addEventListener("DOMContentLoaded", async () => {
  const datalist = document.getElementById("listaAeropuertos");

  try {
    const respuesta = await fetch("../data/vuelos_demo.json");
    const datos = await respuesta.json();

    datos.aeropuertos.forEach((a) => {
      const option = document.createElement("option");
      option.value = a.codigo;
      option.label = `${a.codigo} - ${a.ciudad}, ${a.pais}`;
      datalist.appendChild(option);
    });
  } catch (e) {
    console.error("No se pudo cargar la lista de aeropuertos", e);
  }
});

async function buscarRuta() {
  const origen = document.getElementById("origen").value.trim();
  const destino = document.getElementById("destino").value.trim();
  const criterio = document.getElementById("criterio").value;
  const mensajeError = document.getElementById("mensaje-error");
  const resultado = document.getElementById("resultado");
  const loader = document.getElementById("loader");

  mensajeError.style.display = "none";
  resultado.innerHTML = "";

  function validarCodigoIATA(codigo) {
    return /^[A-Z]{3}$/.test(codigo.trim().toUpperCase());
  }

  if (!validarCodigoIATA(origen) || !validarCodigoIATA(destino)) {
    mensajeError.textContent =
      "Por favor, ingresa códigos IATA válidos (3 letras mayúsculas).";
    mensajeError.style.display = "block";
    return;
  }

  loader.style.display = "block";

  if (!origen || !destino || origen === destino) {
    mensajeError.textContent =
      "Por favor, ingresa aeropuertos válidos y diferentes.";
    mensajeError.style.display = "block";
    return;
  }

  if (!["precio", "duracion", "escalas"].includes(criterio)) {
    mensajeError.textContent = "Selecciona un criterio válido.";
    mensajeError.style.display = "block";
    return;
  }

  try {
    const respuesta = await fetch("http://localhost:5000/buscar", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ origen, destino, criterio }),
    });

    const datos = await respuesta.json();
    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = "";

    loader.style.display = "none";

    if (datos.resultado) {
      const res = JSON.parse(datos.resultado);
      const total =
        criterio === "precio"
          ? `$${res.precio}`
          : criterio === "duracion"
          ? `${res.duracion} h`
          : `${res.escalas} escala(s)`;

      divResultado.innerHTML = `
            <div class="col-12 col-md-6 offset-md-3">
              <div class="card shadow border-0">
                <div class="card-body">
                  <h5 class="card-title text-primary">Ruta óptima por ${criterio}</h5>
                  <ul class="list-group list-group-flush mb-3">
                    ${res.ruta
                      .map((a) => `<li class="list-group-item">✈️ ${a}</li>`)
                      .join("")}
                  </ul>
                  <p class="card-text"><strong>Total:</strong> ${total}</p>
                </div>
              </div>
            </div>
          `;
      const coordenadas = {
        BOG: [300, 200],
        MDE: [220, 250],
        CTG: [150, 180],
        CUC: [400, 150],
        CLO: [250, 300],
        SMR: [120, 140],
        BAQ: [130, 160],
        PEI: [270, 270],
      };

      const infoAeropuertos = {
        BOG: { nombre: "El Dorado", ciudad: "Bogotá", pais: "Colombia" },
        MDE: {
          nombre: "José María Córdova",
          ciudad: "Medellín",
          pais: "Colombia",
        },
        CTG: {
          nombre: "Rafael Núñez",
          ciudad: "Cartagena",
          pais: "Colombia",
        },
        CUC: {
          nombre: "Camilo Daza",
          ciudad: "Cúcuta",
          pais: "Colombia",
        },
        CLO: {
          nombre: "Alfonso Bonilla Aragón",
          ciudad: "Cali",
          pais: "Colombia",
        },
        SMR: {
          nombre: "Simón Bolívar",
          ciudad: "Santa Marta",
          pais: "Colombia",
        },
        BAQ: {
          nombre: "Ernesto Cortissoz",
          ciudad: "Barranquilla",
          pais: "Colombia",
        },
        PEI: { nombre: "Matecaña", ciudad: "Pereira", pais: "Colombia" },
      };

      const svg = document.getElementById("svgMapa");
      svg.innerHTML = "";

      let timeline = gsap.timeline();

      for (let i = 0; i < res.ruta.length - 1; i++) {
        const [x1, y1] = coordenadas[res.ruta[i]];
        const [x2, y2] = coordenadas[res.ruta[i + 1]];

        const linea = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        linea.setAttribute("x1", x1);
        linea.setAttribute("y1", y1);
        linea.setAttribute("x2", x1);
        linea.setAttribute("y2", y1);
        linea.setAttribute("stroke", "#0a9396");
        linea.setAttribute("stroke-width", "2");
        svg.appendChild(linea);

        timeline.to(
          linea,
          {
            duration: 0.4,
            attr: { x2, y2 },
            ease: "power1.out",
          },
          "+=0.05"
        );
      }

      const tooltip = document.getElementById("tooltip");

      res.ruta.forEach((cod) => {
        const [x, y] = coordenadas[cod];
        const { nombre, ciudad, pais } = infoAeropuertos[cod];

        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 0);
        circle.setAttribute("fill", "#005f73");
        circle.style.cursor = "pointer";

        let tooltipTimeout;

        circle.addEventListener("mouseover", (e) => {
          mostrarTooltip(e.pageX, e.pageY, nombre, ciudad, pais);
        });

        circle.addEventListener("mousemove", (e) => {
          moverTooltip(e.pageX, e.pageY);
        });

        circle.addEventListener("mouseleave", () => {
          ocultarTooltip();
        });

        circle.addEventListener("touchstart", (e) => {
          const touch = e.touches[0];
          mostrarTooltip(touch.pageX, touch.pageY, nombre, ciudad, pais);

          clearTimeout(tooltipTimeout);
          tooltipTimeout = setTimeout(() => {
            ocultarTooltip();
          }, 3000);
        });

        svg.appendChild(circle);

        timeline.to(
          circle,
          {
            duration: 0.3,
            attr: { r: 6 },
            ease: "back.out(2)",
          },
          "-=0.2"
        );

        const label = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        label.setAttribute("x", x + 8);
        label.setAttribute("y", y + 4);
        label.setAttribute("font-size", "12px");
        label.setAttribute("fill", "#333");
        label.setAttribute("opacity", 0);
        label.textContent = cod;
        svg.appendChild(label);

        timeline.to(
          label,
          {
            duration: 0.2,
            opacity: 1,
            ease: "power1.inOut",
          },
          "-=0.3"
        );
      });
    } else {
      divResultado.innerHTML = `<div class="alert alert-danger">${datos.error}</div>`;
    }
  } catch (e) {
    loader.style.display = "none";
    mensajeError.textContent = "No se pudo conectar con el servidor.";
    mensajeError.style.display = "block";
  }

  function mostrarTooltip(x, y, nombre, ciudad, pais) {
    tooltip.innerHTML = `<strong>${nombre}</strong><br>${ciudad}, ${pais}`;
    tooltip.style.top = `${y - 40}px`;
    tooltip.style.left = `${x + 10}px`;
    tooltip.classList.add("show");
  }

  function moverTooltip(x, y) {
    tooltip.style.top = `${y - 40}px`;
    tooltip.style.left = `${x + 10}px`;
  }

  function ocultarTooltip() {
    tooltip.classList.remove("show");
  }
}
