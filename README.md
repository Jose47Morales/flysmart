# FlySmart - Optimizador de rutas de vuelo inteligentes

![Logo](https://github.com/user-attachments/assets/8a37ba96-0ede-473f-b33f-04450e896dcf)

**FlySmart** es una herramienta interactiva que permite a los usuarios encontrar la mejor ruta de vuelo entre dos aeropuertos según criterios como precio, duración del vuelo o número de escalas. El sistema utiliza el algoritmo Dijkstra para brindar decisiones inteligentes y una experiencia de compra de boletos más eficiente.

---

## Requisitos

### Python
- Python 3.X
- Flask
- Flask-CORS

Instalar dependencias:

```bash
pip install -r requirements.txt
```

### C++

* Compilador **g++** (recomendado)
* Biblioteca **nlohmann/json** (ya integrada en **include/**)

--- 

## Cómo ejecutar el proyecto

### 1. Compilar el ejecutable (si aún no existe)
```bash
g++ src/*.cpp -o flysmart
```
| Alternativamente puedes usar el script **build.bat** en Windows

### 2. Iniciar el backend
```bash
python app.py
```
| Esto levantará el servidor en **http://localhost:5000**

### 3. Ejecutar la interfaz web
1. Abre el archivo frontend/index.html
2. Utiliza la extensión Live Server (recomendada en VS Code)
3. Interactúa con el formulario de búsqueda de vuelos

![image](https://github.com/user-attachments/assets/92db6691-82ab-462c-9818-1ac139ebc064)


---

## Funcionlidades principales

* Generación y crga dinámica de rutas desde el archivo JSON **(data/vuelos_demo.json)**
* Ejecución del algoritmo de Dijkstra con criterio ajustable:
  * precio
  * duracion
  * escalas
* Visualización de la mejor ruta encontrada
* Comunicación entre el backend Python <-> C++ ejecutable
* Interfaz clara, extensible a producción

---

## Considerciones

* El archivo **flysmart.exe** debe permanecer en la raíz del proyecto para que **app.py** funcione correctamente.
* **data/vuelos_demo.json** contiene los vuelos entre aeropuertos y puede modificarse o extenderse según se requiera.

---

## Estado actual del proyecto

* ✅ Diseño de base de datos
* ✅ Modelo de clases
* ✅ Implementación de algoritmo
* ✅ Integración con frontend
* ✅ Desarrollo del backend API
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

[Documentación](https://jose47morales.github.io/flysmart/)

---

## Autor

*Jose Morales*
* Desarrollador de software | Apasionado por la innovación y algoritmos aplicados

* Contacto: josemoralesleon58@gmail.com - [LinkedIn](https://www.linkedin.com/in/jose-alberto-morales-leon-963935346/)

---

## Licencia

MIT License - libre uso y modificación con fines educativos y profesionales.
