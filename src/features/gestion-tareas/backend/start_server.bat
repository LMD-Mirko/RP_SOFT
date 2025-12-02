@echo off
echo ========================================
echo INICIANDO BACKEND DJANGO - GESTION TAREAS
echo ========================================

echo 1. Verificando Python...
python --version

echo 2. Instalando dependencias si es necesario...
pip install -r requirements.txt

echo 3. Aplicando migraciones...
python manage.py migrate

echo 4. Creando superusuario (si es la primera vez)...
echo Si deseas crear un superusuario, ejecuta: python manage.py createsuperuser
echo.
echo 5. Iniciando servidor...
echo El servidor se iniciara en: http://localhost:8000/
echo Presiona CTRL+C para detener
echo.
echo ========================================
python manage.py runserver

echo.
echo Servidor detenido.
pause