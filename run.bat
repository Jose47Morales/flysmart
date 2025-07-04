@echo off
chcp 65001 > nul
echo Ejecutando FlySmart...

if exist flysmart.exe (
    flysmart.exe
) else (
    echo El ejecutable flysmart.exe no existe. ¿Lo compilaste? 
)

pause