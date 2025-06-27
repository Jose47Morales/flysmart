@echo off
REM === Generar la documentación con Doxygen ===
echo Fenerando documentación con Doxygen...
doxygen Doxyfile

REM === Verificar si la carpeta docs/html existe ===
IF NOT EXIST "docs\hmtl\index.html" (
    echo La socumentación no se generó correctamente. ¿Está Doxygen instalado?
    exit /b 
)

REM === Borrar los archivos viejos (excepto Doxyfile si está en docs) ===
echo Limpiando la carpeta docs/...
for %%F in (docs\*) do (
    if not "%%~nxF"=="html" (
        del /q "%%F"
    )
) 
rmdir /s /q docs\html

REM === Mover los archivos de html/ a docs/ ===
echo Moviendo la documentación generada a docs/...
xcopy /E /Y docs\html\* docs\

REM === Confirmación ===
echo Documentación lista en docs/ para GitHub Pages.