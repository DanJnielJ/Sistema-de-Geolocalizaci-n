<?php
/*En este archivo estan las consultas sql para obtener la información de un registro en específico
Se utiliza en los metodos detalles y editar del archivo ajax.js */

//Se llama al archivo database.php
include("database.php");

//Se comprueba que el POST no venga vacío
if(isset($_POST["id"])) {

    //Se pasa el valor a una variable local y se realiza la consulta select a la tabla viajes
    $id = $_POST["id"];

    $query = "SELECT * FROM viajes WHERE id = {$id} ";
    $result = mysqli_query($connection, $query);

    //En caso de error, muere el proceso y se muestra mensaje de error
    if(!$result) {
        die("Hubo un error en la consulta". mysqli_error($connection));
    }

    //Se crea una variable array, al cual se le pasan los datos que traiga de vuelta $result 
    $json = array();

    while($row = mysqli_fetch_array($result)){
        $json[] = array(
            "id"=>$row["id"],
            "usuario_solicitante" =>$row["usuario_solicitante"],
            "fecha_viaje" =>$row["fecha_viaje"],
            "origen_direccion" =>$row["origen_direccion"],
            "origen_comuna" =>$row["origen_comuna"],
            "origen_contacto" =>$row["origen_contacto"],
            "destino_direccion" =>$row["destino_direccion"],
            "destino_comuna" =>$row["destino_comuna"],
            "destino_contacto" =>$row["destino_contacto"],
            "usuario_ejecutivo" =>$row["usuario_ejecutivo"],
            "valor"  =>$row["valor"]
        );
    }

    //Se crea una nueva variable que contiene los datos en formato json
    //En este caso se hace así, ya que solo se quieren obtener los datos de un registro
    //y para hacerlo se utiliza el [0]
    $jsonstring = json_encode($json[0]);

    //Se envian los datos a la función AJAX
    echo $jsonstring;
}