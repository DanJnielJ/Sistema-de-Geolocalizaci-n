<?php
/*En este archivo estan las consultas sql para la eliminación de un registro en específico,
cuya función esta en ajax.js*/

//Se llama al archivo database.php
include ("database.php");

//Se verifica que el POST no venga vacío
if(isset($_POST["id"])){

    //Se pasa el valor que trae el POST a la variable $id
    $id = $_POST["id"];

    //Se escribe y se ejecuta la consulta delete en la tabla viajes
    $query = "Delete from viajes where id = $id";
    $result = mysqli_query($connection, $query);

    if(!$result) {
        die("Hubo un error en la consulta". mysqli_error($connection));
    }
}