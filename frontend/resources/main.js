window.addEventListener("load", () => {

          const originalPath = document.querySelector("#flightPath");
          const totalLength = originalPath.getTotalLength();

          const midpoint = originalPath.getPointAtLength(totalLength / 2);

          function splitPathAtHalf(path, segments = 100) {
            const len = path.getTotalLength();
            const half = len / 2;
            let backPath = "";
            let frontPath = "";
            let hasStartedFront = false;

            for (let i = 0; i <= segments; i++) {
              const progress = (i / segments) * len;
              const pt = path.getPointAtLength(progress);
              const cmdBack = i === 0 ? "M" : "L";
              
              if (progress <= half) {
                backPath += `${cmdBack}${pt.x},${pt.y} `;
              } else {
                if (!hasStartedFront){
                  frontPath += `M${pt.x},${pt.y} `;
                  hasStartedFront = true;
                } else{
                  frontPath += `L${pt.x},${pt.y} `;
                }
              }
            }

            return { backPath: backPath.trim(), frontPath: frontPath.trim() };
          }

          const { backPath, frontPath } = splitPathAtHalf(originalPath);

          const svg = document.querySelector("#flysmart-logo");
          const planeBehind = document.getElementById("plane-behind");
          const planeFront = document.getElementById("plane-front");

          const back = document.createElementNS("http://www.w3.org/2000/svg", "path");
          back.setAttribute("id", "flightPath-back");
          back.setAttribute("d", backPath);
          back.setAttribute("fill", "none");
          back.setAttribute("stroke", "transparent");
          svg.appendChild(back);

          const front = document.createElementNS("http://www.w3.org/2000/svg", "path");
          front.setAttribute("id", "flightPath-front");
          front.setAttribute("d", frontPath);
          front.setAttribute("fill", "none");
          front.setAttribute("stroke", "transparent");
          svg.appendChild(front);

          function cloneTrail(idFrom, idTo, color) {
            const ref = document.getElementById(idFrom);

            if(!ref) {
              console.error(`No se encontró el elemento con id "${idFrom}"`);
            }

            const d = ref.getAttribute("d");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("id", idTo);
            path.setAttribute("d", d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", color);
            path.setAttribute("stroke-width", "4");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-dasharray", "1000");
            path.setAttribute("stroke-dashoffset", "1000");
            ref.parentNode.insertBefore(path, ref.nextElementSibling);
          }
          
          svg.insertBefore(back, planeBehind);
          cloneTrail("flightPath-back", "trailPath-back", "#a5bfc0");
          const trailBack = document.getElementById("trailPath-back");

          svg.insertBefore(front, planeFront)
          cloneTrail("flightPath-front", "trailPath-front", "#a5bfc0");
          const trailFront = document.getElementById("trailPath-front");

          document.getElementById("plane-front").style.visibility = "hidden";
          document.getElementById("plane-behind").style.visibility = "visible";


          const backLength = document.getElementById("flightPath-back").getTotalLength();
          const frontLength = document.getElementById("flightPath-front").getTotalLength();

          trailBack.setAttribute("stroke-dasharray", backLength);
          trailBack.setAttribute("stroke-dashoffset", backLength);
          
          trailFront.setAttribute("stroke-dasharray", frontLength);
          trailFront.setAttribute("stroke-dashoffset", frontLength);

          gsap.to(trailBack, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power1.in"
          });

          gsap.to("#plane-behind", {
            duration: 2,
            ease: "power1.in",
            motionPath: {
              path: "#flightPath-back",
              align: "#flightPath-back",
              alignOrigin: [0.5, 0.5],
              autoRotate: true,
            },
            onComplete: () => {
              document.getElementById("plane-behind").style.visibility =
                "hidden";
              document.getElementById("plane-front").style.visibility =
                "visible";
            }
          });

          gsap.to(trailFront, {
            strokeDashoffset: 0,
            duration: 2,
            delay: 2,
            ease: "power1.out"
          });

          gsap.to("#plane-front", {
            delay: 2,
            duration: 2,
            ease: "power1.out",
            motionPath: {
              path: "#flightPath-front",
              align: "#flightPath-front",
              alignOrigin: [0.5, 0.5],
              autoRotate: true,
            },
            onComplete: () => {
              gsap.to("#flysmart-animation", {
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                onComplete: () => {
                  document.getElementById("flysmart-animation").style.display = "none";

                  const heading = document.querySelector(".flysmart-heading");
                  heading.style.opacity = "1";
                  heading.style.transform = "translateY(0)";

                  gsap.fromTo("#logo-target",
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1, ease: "power2.out", delay: 0.1}
                  );

                  gsap.to(".flysmart-fade", {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power2.out",
                    delay: 0.3
                  });
                }
              });
            },
          });
        });

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
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
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
    loader.style.display = "none";
    return;
  }

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
      body: JSON.stringify({ origen, destino, criterio }),
    });

    const datos = await respuesta.json();
    console.log("Respuesta cruda del backend:", datos);
    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = "";

    loader.style.display = "none";

    if (datos) {
      const res = datos;

      const { ruta, precio, duracion, escalas } = res;

      if (!ruta || ruta.length < 2) {
        mensajeError.textContent = "Ruta no encontrada.";
        mensajeError.style.display = "block";
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

      const svg = document.getElementById("svgMapa");
      svg.innerHTML = "";

      let timeline = gsap.timeline();

      for (let i = 0; i < res.ruta.length - 1; i++) {
        const cod1 = res.ruta[i].codigo;
        const cod2 = res.ruta[i + 1].codigo;
        
        const [x1, y1] = coordenadas[cod1];
        const [x2, y2] = coordenadas[cod2];

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

      res.ruta.forEach((aeropuerto) => {
        const cod = aeropuerto.codigo;
        const [x, y] = coordenadas[cod];
        const { nombre, ciudad, pais } = aeropuerto;

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
