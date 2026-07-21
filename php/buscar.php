<?php
//En este archivo estan las consultas para la función de búsqueda del archivo ajax.js

// Se llama al archivo que tiene la conexión con la base de datos
include("database.php");

//isset comprueba si esta enviando información en usuario_ejecutivo en el metodo POST
//Si no se envian datos, entonces las instrucciones dentro del if no se ejecutan

if (isset($_POST["usuario_ejecutivo"])) {

    //Se pasa el valor recibido en una variable local
    $search = $_POST["usuario_ejecutivo"];
    
    //Se hace una consulta sql en la base de datos viajes para traer los registros cuyo 
    //Usuario_ejecutivo sea similar al valor que se pasa
    $query = "SELECT * FROM viajes WHERE usuario_ejecutivo LIKE '%$search%'";

    //$result ejecuta la consulta utilizando mysqli_query, la cual necesita la varibale que
    //Contenga la conexión a la base de datos (esta se encuentra en el archivo database.php)
    $result = mysqli_query($connection, $query);

    //Si la consulta falla, se detiene la ejecución (die()) y muestra el error de MySQL.
    if (!$result) {
        die("Hubo un error en la consulta: " . mysqli_error($connection));
    }

    //Se crea una variable $json del tipo array.
    //Mediante mysqli_fetch_array($result) y un while se recorre cada fila obtenida de la consulta.
    //Cada fila se guarda en $json como un array asociativo con las columnas de la tabla viajes.
    $json = array();
    while ($row = mysqli_fetch_array($result)) {
        $json[] = array(
            "id" => $row["id"],
            "usuario_solicitante" => $row["usuario_solicitante"],
            "fecha_viaje" => $row["fecha_viaje"],
            "origen_direccion" => $row["origen_direccion"],
            "origen_comuna" => $row["origen_comuna"],
            "origen_contacto" => $row["origen_contacto"],
            "destino_direccion" => $row["destino_direccion"],
            "destino_comuna" => $row["destino_comuna"],
            "destino_contacto" => $row["destino_contacto"],
            "usuario_ejecutivo" => $row["usuario_ejecutivo"],
            "valor" => $row["valor"]
        );
    }

    //Se convierte el array a un formato json y se devuelve como respuesta a la solicitud AJAX.
    echo json_encode($json);
}
?>
