@echo off

set COMPILER=g++
set SOURCES=src\main.cpp src\Aeropuerto.cpp src\Vuelo.cpp src\GrafoDeRutas.cpp src\Dijkstra.cpp
set INCLUDE=-Iinclude
set OUTPUT=flysmart.exe
set FLAGS=-Wall -std=c++17

%COMPILER% %SOURCES% %INCLUDE% %FLAGS% -o %OUTPUT%

if %ERRORLEVEL% neq 0 (
    echo Error durante la compilación.
    pause
    exit /b
) 

echo Compilación exitosa.
echo Ejecutando FlySmart...
echo.

%OUTPUT%

pause