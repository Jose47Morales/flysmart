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
        if (!hasStartedFront) {
          frontPath += `M${pt.x},${pt.y} `;
          hasStartedFront = true;
        } else {
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

    if (!ref) {
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

  svg.insertBefore(front, planeFront);
  cloneTrail("flightPath-front", "trailPath-front", "#a5bfc0");
  const trailFront = document.getElementById("trailPath-front");

  document.getElementById("plane-front").style.visibility = "hidden";
  document.getElementById("plane-behind").style.visibility = "visible";

  const backLength = document
    .getElementById("flightPath-back")
    .getTotalLength();
  const frontLength = document
    .getElementById("flightPath-front")
    .getTotalLength();

  trailBack.setAttribute("stroke-dasharray", backLength);
  trailBack.setAttribute("stroke-dashoffset", backLength);

  trailFront.setAttribute("stroke-dasharray", frontLength);
  trailFront.setAttribute("stroke-dashoffset", frontLength);

  gsap.to(trailBack, {
    strokeDashoffset: 0,
    duration: 2,
    ease: "power1.in",
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
      document.getElementById("plane-behind").style.visibility = "hidden";
      document.getElementById("plane-front").style.visibility = "visible";
    },
  });

  gsap.to(trailFront, {
    strokeDashoffset: 0,
    duration: 2,
    delay: 2,
    ease: "power1.out",
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

          gsap.fromTo(
            "#logo-target",
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
              delay: 0.1,
            }
          );

          gsap.to(".flysmart-fade", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            delay: 0.3,
          });
        },
      });
    },
  });
});