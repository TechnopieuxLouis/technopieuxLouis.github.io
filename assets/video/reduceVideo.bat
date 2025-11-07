@echo off
setlocal enabledelayedexpansion

echo Debut de la conversion des fichiers Video_*.mp4...
echo.

for %%f in (Video_*.mp4) do (
    echo Traitement de : %%f
    
    REM Extraire le nom de base du fichier sans extension
    set "filename=%%~nf"
    
    REM Creer le nom de fichier de sortie
    set "output=!filename!_converted.mp4"
    
    REM Executer la commande FFmpeg
    ffmpeg.exe -i "%%f" -c:v libx264 -crf 28 -preset medium -an -sn -vf "scale=1080:-1" "!output!"
    
    if !errorlevel! equ 0 (
        echo [OK] %%f converti vers !output!
    ) else (
        echo [ERREUR] Echec de la conversion de %%f
    )
    echo.
)

echo Conversion terminee !
pause