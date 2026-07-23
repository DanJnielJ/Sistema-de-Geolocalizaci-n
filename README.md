====================================
README - Sistema de Geolocalización
====================================

## Descripción
Sistema web desarrollado como prueba técnica para administrar los datos de los viajes realizados por los trabajadores de una empresa de transportes.

## Tecnologías utilizadas
- Visual Studio Code
- PHP
- HTML5
- CSS3
- JavaScript
- jQuery
- AJAX
- MySQL
- Google Maps JavaScript API

## Servicios de Google Maps utilizados
- Google Maps JavaScript API (visualización del mapa).
- Geocoder (conversión de direcciones en coordenadas geográficas).
- Directions Service (cálculo y visualización de rutas).
- Distance Matrix Service (cálculo de distancias y tiempos estimados entre ubicaciones).

## Funcionalidades
- Carga asíncrona de datos mediante AJAX.
- Paginación de registros.
- Administración de los viajes mediante una interfaz web.
- Visualización de rutas en Google Maps.
- Cálculo de distancias y tiempos estimados entre origen y destino.

## Base de datos
La base de datos puede crearse importando el archivo `transportes.sql` en MySQL, motor utilizado durante el desarrollo del proyecto.
El script incluye aproximadamente 500 registros de prueba. Las direcciones almacenadas son ficticias, por lo que para visualizar correctamente las rutas en Google Maps se recomienda crear nuevos registros utilizando direcciones reales.

## Instalación
1. Clonar el repositorio.
2. En la siguiente ruta colocar la carpeta del proyecto:
   C:\xampp\htdocs

   Esto cambia dependiendo de donde se haya instalado xampp en caso de contar con más de un disco en el equipo.
4. Iniciar Apache y MySQL en xampp.
5. En el navegador colocar algo como: localhost/PanelAdministracion

   PanelAdministracion es el nombre original de la carpeta del proyecto, pero al descargar el repositorio, el nombre que tenga sera el de este, pero uno lo puede cambiar por algo más corto.

================================================================

Al final del archivo `index.html` se encuentra la línea que carga la Google Maps JavaScript API.
Para utilizar las funcionalidades relacionadas con Google Maps, es necesario reemplazar la API Key incluida en el proyecto por una propia obtenida desde Google Cloud Platform, habilitando los servicios correspondientes.


## Autor
Daniel Vicente Jara Uribe

GitHub: https://github.com/DanVic-JarUri
