<?php
/*En este archivo estan las consultas para la creación de un nuevo registro,
cuyo metodo se encuentra en el archivo ajax.js*/

//Se llama al archivo con la conexión a la db.
include("database.php");

//Se comprueba que el POST traiga datos.
//En caso de traer datos, estos se pasan a variables locales.
if(isset($_POST["usuario_solicitante"])){
    $usuario_solicitante = $_POST["usuario_solicitante"];
    $fecha_viaje = $_POST["fecha_viaje"];
    $origen_direccion = $_POST["origen_direccion"];
    $origen_comuna  = $_POST["origen_comuna"];
    $origen_contacto = $_POST["origen_contacto"];
    $destino_direccion = $_POST["destino_direccion"];
    $destino_comuna = $_POST["destino_comuna"];
    $destino_contacto = $_POST["destino_contacto"];
    $usuario_ejecutivo = $_POST["usuario_ejecutivo"];
    $valor = $_POST["valor"];

    //Se hace una consulta insert into a la tabla viajes en la variable $query
    $query = "insert into viajes (fecha_viaje, origen_direccion, origen_comuna, origen_contacto, 
                destino_direccion, destino_comuna, destino_contacto, usuario_ejecutivo, usuario_solicitante, valor) values
                ('$fecha_viaje', '$origen_direccion', '$origen_comuna', '$origen_contacto', 
                '$destino_direccion', '$destino_comuna', '$destino_contacto', '$usuario_ejecutivo', '$usuario_solicitante', '$valor')";
    
    //Se envia la instrucción a la base de datos
    $result = mysqli_query($connection, $query);

    //En caso de error, el proceso muere y se muestra un mensaje con el error
    if(!$result) {
        die("Hubo un error en la consulta". mysqli_error($connecction));
    }

}