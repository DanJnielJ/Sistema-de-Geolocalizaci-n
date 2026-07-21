//En este archivo se encuentran los metodos js y ajax 
// que se encargan de hacer las operaciones CRUD y de las funciones del mapa

$(function() {

    //Llamamos a la función fetchTravel (que se encuentra más abajo), para ejecutar el metodo al iniciar el sistema
    fetchTravel();

    //Variable booleana que se utilizara para verificar si se esta haciendo un nuevo registro
    //o si se esta actualizando un registro ya existente
    //Se inicializa en false
    let edit = false;

    // Variable global utilizada en la función initMap
    let directionsRenderer = null;

    // Función para buscar viajes en tiempo real
    
    $("#search").on("keyup", function () {//Detecta el input con el id search y detecta cuando se escribe en este
    
        let searchValue = $(this).val(); // Capturar el valor ingresado

        //Metodo ajax para carga asincronica
        $.ajax({
            url: "php/buscar.php", // Archivo PHP que procesará la búsqueda
            type: "POST", // El tipo se solicitud HTTP que se hace
            data: { usuario_ejecutivo: searchValue }, // Se pasa el valor capturado a otra variable, que sera enviada al archivo php
            success: function (response) { // Si la solicitud ajax resulta, se ejecuta el siguiente codigo
                //response contiene los datos que devuelve el archivo php
                //Si no hay ningún error, se ejecuta el if
                if (!response.error) {

                    const travel = JSON.parse(response); //Convierte el response en un array de objetos js
                    let template = ""; //Variable inicializada en vacío que va utilizarse para mostrar los registros en la vista

                    //Se recorre el array travel con un foreach y se genera dinamicamente una fila
                    //por cada registro encontrado
                    travel.forEach((v) => {
                    
                        //Las filas se pasan a la variable template y se concatena con la siguiente
                        template += `
                            <tr travelID="${v.id}">
                                <td class="text-center">
                                    <a href="#" class="travel-detail">${v.id}</a>
                                </td>
                                <td class="text-center">${v.usuario_solicitante}</td>
                                <td class="text-center">${v.usuario_ejecutivo}</td>
                                <td class="text-center">${v.fecha_viaje}</td>
                                <td class="text-center">${v.valor}</td>
                                <td class="text-center">
                                    <button class="btn btn-danger travel-delete">Eliminar</button>
                                    <button class="btn btn-warning travel-edit">Editar</button>
                                </td>
                            </tr>
                        `;
                    });

                    //Se detecta el objeto html con el id "viajes", que es donde se mostraran los datos,
                    // y  se le pasa el template. De esta manera se insertan dinamicamente las filas 
                    // generadas con los resultados
                    $("#viajes").html(template);
                }
            },
            //En caso de un error en el ajax, se mostrara un error en la consola
            error: function () {
                console.log("Error en la búsqueda");
            },
        });
    });


    //Función para guardar registro

    //Detecta el objeto html con el id "form-viaje" y ejecuta el codigo al hacer clic en el boton guardar del tipo submit
    $("#form-viaje").submit((e) => {

        e.preventDefault(); // Previene que la página se recargue al hacer clic en guardar

        //Constante que almacena momentaneamente los datos ingresados en el formulario
        
        const postData = {
            //'#usuario_solicitante' es el id del input en el formulario. Lo mismo sucede con el resto de los datos
            usuario_solicitante : $("#usuario_solicitante").val(),
            fecha_viaje : $("#fecha_viaje").val(),
            origen_direccion : $("#origen_direccion").val(),
            origen_comuna : $("#origen_comuna").val(),
            origen_contacto : $("#origen_contacto").val(),
            destino_direccion : $("#destino_direccion").val(),
            destino_comuna : $("#destino_comuna").val(),
            destino_contacto : $("#destino_contacto").val(),
            usuario_ejecutivo : $("#usuario_ejecutivo").val(),
            valor : $("#valor").val(),
            id : $("#id").val()
        };

        // Validar si algún campo está vacío (excepto id)
        for (let key in postData) {
            if (key !== "id" && postData[key] === "") {
                alert(`El campo ${key.replace("_", " ")} no puede estar vacío`);
                return;
            }
        }


        //Se declara la variable url y se consulta si la varibale edit sigue siendo false
        //Si es false, entonces el valor asignado a url va a ser la dirección del archivo create.php
        //En caso contrario, se pasa la dirección del archivo edit.php
        const url = edit === false ? "php/create.php" : "php/edit.php";

        //Metodo ajax que llama al metodo create o edit 
        $.ajax({
            url : url,
            data : postData,
            type: "POST",
            success: function (response){ //success verifica si la consulta ajax se ejecuto correctamenta.
                
                //Si no hubo error, limpiara el formulario con el metodo trigger
                if(!response.error){
                    fetchTravel();
                    $("#form-viaje").trigger("reset");
                    edit = false; 
                    //En el caso de que se ejecute una actualización, se vuelve a declarar
                    //a la variable "edit" como false
                }
            }
        });

    });

    //fetchTravel es la función que permite mostrar todos los registros de la base de datos
    function fetchTravel(page = 1) { // page se utiliza para indicar qque la página actual y por defecto es la 1
        
        $.ajax({
            url: "php/read.php", //Archivo php en donde esta la consulta sql
            type: "GET", //El tipo de metodo HTTP que se va a ejecutar
            //En este caso se envian dos parámetros a read.php
            data: {
                page: page, //Es el número de página solicitado
                limit: 25 //La cantidad de registros máxima a mostrar por página
            },

            success: function(response) {
                //Se convierte el resultado en un objeto js y se extraen los datos de la clave 'data'
                const travel = JSON.parse(response).data;

                //Se extrae el número total de páginas de la calve 'totalPages'
                const totalPages = JSON.parse(response).totalPages;

                //Se declara una variable vacía que se va a llenar a medida que el foreach recorra
                //los registros de la variable travel
                let template = ``;
                travel.forEach(v => {
                    template += `
                    <tr travelID="${v.id}">
                        <td class="text-center">
                            <a href="#" class="travel-detail">${v.id}</a>
                        </td>
                        <td class="text-center">${v.usuario_solicitante}</td>
                        <td class="text-center">${v.usuario_ejecutivo}</td>
                        <td class="text-center">${v.fecha_viaje}</td>
                        <td class="text-center">${v.valor}</td>
                        <td class="text-center">
                            <button class="btn btn-danger travel-delete">Eliminar</button>
                            <button class="btn btn-warning travel-edit">Editar</button>
                        </td>
                    </tr>
                    `;
                    //El id se deja como enlace y se le da la clase 'travel-detail'.
                    //Esto se hace para mpas adelante poder obtener el detalle del viaje
                });

                $("#viajes").html(template); //Se cargan las filas generadas en el tbody con el id "viajes"
                renderPagination(totalPages, page); //Se llama al metodo que mostrara los botones de la paginación
                //totalpages es el número total de páginas y page es la página actual
            }
        });
    }

    // Función para renderizar la paginación

    function renderPagination(totalPages, currentPage) {//totalpages es el número total de páginas y currentPage es la página actual
        
        //Se delara una variable va a ir almacenando el html de los botones
        let pagination = '';
    
        // Usar la clase de Bootstrap para la paginación
        pagination += `<ul class="pagination justify-content-center">`;

        // Mostrar el botón de 'Prev' solo si no estamos en la primera página
        if (currentPage > 1) {
            pagination += `<li class="page-item"> 
                <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo; </a>
            </li>`;
            //page-item y page-link le da los estilos mientras que data-page indica
            //la página anterior a la actual
        }

        // Metodo for utilizado para generar los números de las páginas
        for (let i = 1; i <= totalPages; i++) {
            pagination += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
            //En data-page se genera un botón para cada página
            //currentPage y active sirven para resaltar el botón de la página actual
        }

        // Mostrar el botón de 'Next' solo si no estamos en la última página
        if (currentPage < totalPages) {
            pagination += `<li class="page-item">
                <a class="page-link" href="#" data-page="${currentPage + 1}"> &raquo;</a>
            </li>`;
            //Es lo mismo que con el botón 'Prev', solo que se suma
        }

        pagination += `</ul>`; // Cerrar la lista de paginación
        
        // Mostrar los botones de paginación en el objeto con el id "pagination"
        $("#pagination").html(pagination); 
    }

    // Manejar clics en los enlaces de paginación
    $(document).on("click", ".page-link", function(e) { //Se captura el clic en cualquier botón de la paginación
        e.preventDefault(); //Evita que se haga una navegación normal (que recargue la página)
        const page = $(this).data("page"); //Obtiene el número de página almacenado en data-page
        fetchTravel(page); // Volver a cargar los viajes de la nueva página
    });


    //Metodo que detecta el clic sobre el el botón de eliminar de un registro
    //Para detectar el botón, se busca aquel que tiene la clase 'travel-delete' 
    //la cual se asigna en la función fetchTravel
    $(document).on("click", ".travel-delete", () =>{
        //'confirm' muestra un mensaje en el navegador para confirmar la eliminación
        if(confirm("¿Estás seguro que quiere eliminar este registro?")){ 
            const element = $(this)[0].activeElement.parentElement.parentElement;
            //const element = $(this)[0].activeElement obtiene el botón que se cliqueo (hay uno botón eliminar por cada registro)
            //'parentElement' se utiliza para escalar en la estructura html de la fila (se usan 2 para llegar al tr) 
            //De esta forma se llega hasta donde esta 'travelID'

            const id = $(element).attr("travelID") //mediante 'attr' se obtiene el valor que trae 'travelID'

            //Este metodo post cumple la misma función que el ajax (es otra manera de hacer la petición)
            $.post("php/delete.php", {id}, function(e) {
                fetchTravel(); //Se recarga la lista de viajes
            });

        }
    });

    //Se detecta el clic en el botón de clase 'travel-edit'
    $(document).on("click", ".travel-edit", () =>{

        //Se obtiene el id del viaje de 'travelID'
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(element).attr("travelID")

        //Variable que contiene la dirección del archivo con la consulta sql
        let url = "php/obtener.php"; //En este archivo esta la consulta para obtener los datos de un registro específico
        //Se define la función ajax
        $.ajax({
            url,
            data: {id},
            type: "POST", 
            success: function(response){
                if(!response.error){
                    const v = JSON.parse(response);

                    //Se pasan los valores que contiene 'v' a los input del formulario
                    $("#usuario_solicitante").val(v.usuario_solicitante)
                    $("#fecha_viaje").val(v.fecha_viaje)
                    $("#origen_direccion").val(v.origen_direccion)
                    $("#origen_comuna").val(v.origen_comuna)
                    $("#origen_contacto").val(v.origen_contacto)
                    $("#destino_direccion").val(v.destino_direccion)
                    $("#destino_comuna").val(v.destino_comuna)
                    $("#destino_contacto").val(v.destino_contacto)
                    $("#usuario_ejecutivo").val(v.usuario_ejecutivo)
                    $("#valor").val(v.valor)

                    $("#id").val(v.id)

                    //'edit' pasa de false a true
                    edit = true;
                    //Con esto, al hacer clicc en el botón guardar se actualizara un registro en vez de hacer uno nuevo
                }
            }
        });
    });


    //Detecta el clic en el objeto html con clase 'travel-detail'
    $(document).on("click", ".travel-detail", function(e) {
        
        e.preventDefault(); //Previenee la recarga de la página

        const element = $(this).closest("tr");
        //'closest("tr")' encuentra el 'tr' más cercano al objeto cliqueado
        //Esta forma es más segura y combiene más el utilizarla en este caso 
        // que el activeElement y parentElement

        //Se obtiene el id del registro
        const id = element.attr("travelID");

        $.ajax({
            url : "php/obtener.php",
            data : {id},
            type : "POST",
            success : function(response){
                if(!response.error){
                    const v = JSON.parse(response);

                    console.log(v);
                    //Variable que almacena el html con los datos
                    let detailTemplate = `
                        <h4>Detalle del Viaje</h4>
                        <p><strong>ID:</strong> ${v.id}</p>
                        <p><strong>Solicitante:</strong> ${v.usuario_solicitante}</p>
                        <p><strong>Ejecutivo:</strong> ${v.usuario_ejecutivo}</p>
                        <p><strong>Fecha:</strong> ${v.fecha_viaje}</p>
                        <p><strong>Origen:</strong> ${v.origen_direccion}, ${v.origen_comuna} (${v.origen_contacto})</p>
                        <p><strong>Destino:</strong> ${v.destino_direccion}, ${v.destino_comuna} (${v.destino_contacto})</p>
                        <p><strong>Valor:</strong> ${v.valor}</p>
                    `;

                    console.log();
                    //Se pasa la estructura generada al objeto con id detalle-viaje, el cúal esta dentro de un modal
                    $("#detalle-viaje").html(detailTemplate);
                    //El modal por defecto esta oculto, por lo que hay que indicarle que se muestre
                    $("#detalleModal").modal("show");

                    //En el modal hay un botón para ver la ruta con el id 'verMapa'
                    $("#verMapa").off("click").on("click", function() {
                        //'off' elimina elimina eventos anteriores en el botón
                        //'on' escucha el clic actual

                        //Se muestra el div que contiene el mapa junto con la información de distancia y tiempo
                        $("#mapaContainer").show();
                        $("#mapa-info").show();
                        
                        //Se crean las variables que van a contener las direcciones de origen y destino (dirección y comuna)
                        let origen = `${v.origen_direccion}, ${v.origen_comuna}`;
                        let destino = `${v.destino_direccion}, ${v.destino_comuna}`;

                        // Llamar a la validación antes de mostrar el mapa
                        validarDirecciones(origen, destino, function(esValido) {
                            if (esValido) {
                                //Si la dirección y comuna son validas, se crean las direcciones completas agregando la región y país
                                let origenCompleto = `${origen}, Región Metropolitana, Chile`;
                                let destinoCompleto = `${destino}, Región Metropolitana, Chile`;
                                //Se llama a la función initMap
                                initMap(origenCompleto, destinoCompleto);
                            } else {
                                //En caso de que la validación de false, se oculta el mapa y muestra un mensaje de error
                                $("#mapaContainer").hide();
                                $("#mapa-info").html("<p style='color: red; text-align: center;'>No se pudo validar la dirección. Verifique los datos ingresados.</p>");
                            }
                        });
                    });
                    
                    // Al cerrar el modal, se oculta el mapa y la información
                    //'off' se utiliza para eliminar eventos anteriores del modal
                    $("#detalleModal").off("hidden.bs.modal").on("hidden.bs.modal", function() {
                        //Se vuelven a ocultar el mapa y la información de distancia y tiempo
                        //De esta forma al ver el detalle de otro registro, el mapa vuelve a estar oculto 
                        $("#mapaContainer").hide();
                        $("#mapa-info").hide();
                    });
                }
            }
        });
    });

    //Función que valida la dirección y comuna mediante coordenadas
    function validarDirecciones(origen, destino, callback) {
        
        //Se llama al servicio de Geocoder para validar datos de dirección
        var geocoder = new google.maps.Geocoder();
        
        // Se pasa el valor de origen y se crea una función que maneja la respuest
        geocoder.geocode({ address: origen }, function (resultsOrigen, statusOrigen) {
            //Si no es valido, devuelve false y un mensaje de error por consola
            if (statusOrigen !== "OK") {
                console.error("Dirección de origen no válida:", statusOrigen);
                callback(false);
                return;
            }
    
            // Validar destino
            geocoder.geocode({ address: destino }, function (resultsDestino, statusDestino) {
                if (statusDestino !== "OK") {
                    console.error("Dirección de destino no válida:", statusDestino);
                    callback(false);
                    return;
                }
    
                // Si ambas direcciones son válidas
                callback(true);
            });
        });
    }

    //Función que muestra un mapa de google maps
    //Calcula y muesttra la ruta entre el origen y destino
    //Llama a la función para calcular distancia y tiempo 
    function initMap(origen, destino) {
        //Muestra por consola las direcciones (Comprueba que los valores sean correctos)
        console.log("Origen:", origen, "Destino:", destino);
    
        //Crea un mapa en el contenedor 'mapaContainer'
        const map = new google.maps.Map(document.getElementById("mapaContainer"), {
            zoom: 10, //Nivel de acercamiento
            center: { lat: -33.4489, lng: -70.6693 } //Centra el mapa en Santiago, Chile
        });
    
        const directionsService = new google.maps.DirectionsService(); //Se llama al servicio de 'DirectionService' para calcular la ruta
        
        // Si ya existe un renderer, lo limpiamos
        if (directionsRenderer) {
            directionsRenderer.setDirections({ routes: [] }); // Limpia la ruta anterior
        } else {
            directionsRenderer = new google.maps.DirectionsRenderer(); // Crear solo si no existe
            //DirectionsRenderer se utiliza para mostrar la ruta
        }
        
        directionsRenderer.setMap(map);//Se asigna el mapa en donde se mostrara la ruta
    
        //Solicituda para crear ruta
        const request = {
            origin: origen,
            destination: destino,
            travelMode: google.maps.TravelMode.DRIVING //Indica que el modo de viaje (en este caso es en auto)
        };
    
        directionsService.route(request, function (result, status) {
            //result contiene la información de la ruta si la consulta (request) fue exitosa
            //status indica si la solicitud fue exitosa o no
            if (status === google.maps.DirectionsStatus.OK) {

                //Dibuja la ruta si las direcciones son correctas
                directionsRenderer.setDirections(result);

                // Llamar a la función de distancia después de calcular la ruta
                calculateDistance(origen, destino); 
            } else {
                //En caso de error, se muestra un error por consola y en un alert
                console.error("Error al calcular ruta:", status); // Muestra error en consola
                alert("No se pudo calcular la ruta. Código de error: " + status);
            }
        });
    }
    
    
    
    //Calcula la distancia y tiempo del recorrido
    function calculateDistance(origen, destino) {
        let service = new google.maps.DistanceMatrixService(); //Servicio que permite calcular distancias y tiempo 
    
        //Recibe un objeto las direcciones de origen y destino, además del modo de viaje
        service.getDistanceMatrix({
            origins: [origen],
            destinations: [destino],
            travelMode: google.maps.TravelMode.DRIVING

        }, function (response, status) {
            //response recibe la información y status el estado de la solicitud
            if (status === "OK") {

                let distance = response.rows[0].elements[0].distance.text; //Variable que obtiene la distancia
                let duration = response.rows[0].elements[0].duration.text; //Variable que obtiene el tiempo
    
                //Se muestra la información en el objeto 'mapa-info'
                $("#mapa-info").html(`
                    <p style="text-align: center;"><strong>Distancia:</strong> ${distance}</p>
                    <p style="text-align: center;"><strong>Duración Estimada:</strong> ${duration}</p>
                `);
            } else {
                //Si la solicitud no es correcta, muestra mensaje de error
                $("#mapa-info").html("<p style='text-align: center;'>No se pudo obtener la distancia y duración.</p>");
            }
        });
    }
    
})