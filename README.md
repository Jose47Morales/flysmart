# FlySmart - Optimizador de rutas de vuelo inteligentes

![Logo](https://github.com/user-attachments/assets/8a37ba96-0ede-473f-b33f-04450e896dcf)

**FlySmart** es una herramienta interactiva que permite a los usuarios encontrar la mejor ruta de vuelo entre dos aeropuertos según criterios como precio, duración del vuelo o número de escalas. El sistema utiliza el algoritmo Dijkstra para brindar decisiones inteligentes y una experiencia de compra de boletos más eficiente.

---

## Objetivo del proyecto

> Ofrece soluciones innovadoras para ayudar a los viajeros en Colombia y en todo el mundo a tomar decisiones más inteligentes al comprar boletos y elegir rutas más económicas, rápidas o directas.

---

## Caracteristicas principales

- Optimización de rutas mediante el algoritmo Dijkstra
- Visualización de vuelos disponibles en formato gráfico
- Filtrar por duración del vuelo, precio o número de escalas
- Interfaz intuitiva para facilitar la entrada de datos de vuelos
- Historial de búsqueda y panel de administración (próximamente)
- Estructura modular expandible

--- 

## Tecnologías utilizadas

| Componente | Tecnología |
|------------|------------|
| Algoritmo principal | C++ |
| Backend API (próximamente) | Python (Flask) / Node.js |
| Base de datos | MySQL / PostgreSQL |
| Frontend (planeado)| HTML, CSS, JavaScript |
| Control de versiones | Git + GitHub |
| Gestión ágil | GitHub Projects (Scrum) |

---

## Estructura del repositorio

* ***/src*** -> Código fuente en C++
* ***/include*** -> Archivos header
* ***/data*** -> Datos de prueba (CSV, JSON)
* ***/docs*** -> Documentación del sistema
* ***README.md*** -> Este archivo

---

## Cómo ejecutar el proyecto (versión consola)

1. Clona el repositorio:

```bash
git clone https://github.com/Jose47Morales/flysmart.git
cd flysmart
```

2. Compila el proyecto (ejemplo con g++)

```bash
g++ src/*.cpp -o flysmart
```

3. Ejecuta:

```bash
./flysmart
```

---

## Datos de prueba

El sistema incluye un conjunto de aeropuertos y vuelos simulados para pruebas, ubicados en **/data/vuelos_demo.json**
Puedes modificar o ampliar estos datos para probar nuevas rutas.

---

## Estado actual del proyecto

* ✅ Diseño de base de datos
* ✅ Modelo de clases
* ✅ Implementación de algoritmo
* 🔄 Integración con frontend
* 🔄 Desarrollo del backend API
* 🔄 Interfaz gráfica completa

---

## Plan de desarrollo
Este proyecto sigue una metodología ágil basada en Scrum.
Puedes consultar el progreso y tareas activas en la pestaña Projects.

---

## Documentación

La documentación técnica del backend ha sido generada con [Doxygen](https://www.doxygen.nl/).

### ¿Qué incluye?
- Diagramas de clases y relaciones.
- Explicación de funciones y métodos.
- Detalles de cada componente del backend.

### Cómo generarla

Si tienes Doxygen instalado, ejecuta:

```bash
doxygen Doxyfile
```

Esto generará la documentación en la carpeta **docs/html/**.

### Acceso rápido

Puedes abrir la documentación localmente con cualquier navegador:

```bash
docs/html/index.html
```

O si el proyecto está publicado en GitHub Pages, puedes accederla desde:

```bash
https://Jose47Morales.github.io/flysmart/docs/html/index.html
```

---

## Autor

*Jose Morales*
* Desarrollador de software | Apasionado por la innovación y algoritmos aplicados

* Contacto: josemoralesleon58@gmail.com - https://www.linkedin.com/in/jose-alberto-morales-leon-963935346/

---

## Licencia

MIT License - libre uso y modificación con fines educativos y profesionales.
