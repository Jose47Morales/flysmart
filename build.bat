@echo off
echo Compilando FlySmart...

set COMPILER=g++

set SOURCES=src\main.cpp src\Aeropuerto.cpp src\Vuelo.cpp src\GrafoDeRutas.cpp src\Dijkstra.cpp

set INCLUDE=-Iinclude

set OUTPUT=flysmart.exe

set FLAGS=-Wall -std=c++17 -fexec-charset=UTF-8

%COMPILER% %SOURCES% %INCLUDE% %FLAGS% -o %OUTPUT%

if %ERRORLEVEL% neq 0 (
    echo Error al compilar.
) else (
    echo Compilación exitosa.
)
pause
