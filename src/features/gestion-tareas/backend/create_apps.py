import os

# Define las aplicaciones y sus capas hexagonales
apps = ['backlog', 'sprint', 'historias', 'metricas']
layers = ['domain', 'application', 'infrastructure', 'presentation']

# Crea la estructura de directorios
for app in apps:
    app_path = f'apps/{app}'
    os.makedirs(app_path, exist_ok=True)
    
    # Crea cada capa
    for layer in layers:
        layer_path = f'{app_path}/{layer}'
        os.makedirs(layer_path, exist_ok=True)
        
        # Crea __init__.py en cada directorio
        with open(f'{layer_path}/__init__.py', 'w') as f:
            f.write('')
    
    # Crea __init__.py en la raíz de la app
    with open(f'{app_path}/__init__.py', 'w') as f:
        f.write('')
    
    # Crea apps.py para la configuración de Django
    with open(f'{app_path}/apps.py', 'w') as f:
        f.write(f'''from django.apps import AppConfig


class {app.capitalize()}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.{app}'
    verbose_name = '{app.capitalize()}'
''')

print("Estructura de aplicaciones creada exitosamente")