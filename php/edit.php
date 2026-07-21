<?php
/*En este archivo estan las consultas para guardar los cambios de un registro en específico, 
cuya función esta en el archivo ajax.js*/

//Se llama al archivo database.php
include("database.php");

//Se comprueba que el POST no venga vacío
//Si no viene vacío, se pasan los datos a variables locales
if(isset($_POST["id"])){
    $id = $_POST["id"];
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

    //Consulta update para actualizar un registro especifico
    $query = "update viajes set usuario_solicitante = '$usuario_solicitante',
                fecha_viaje = '$fecha_viaje',
                origen_direccion = '$origen_direccion',
                origen_comuna = '$origen_comuna',
                origen_contacto = '$origen_contacto',
                destino_direccion = '$destino_direccion',
                destino_comuna = '$destino_comuna',
                destino_contacto = '$destino_contacto',
                usuario_ejecutivo = '$usuario_ejecutivo', 
                valor = '$valor' where id = '$id'";

    
    $result = mysqli_query($connection, $query);

    if(!$result) {
        die("Hubo un error en la consulta". mysqli_error($connecction));
    }

}