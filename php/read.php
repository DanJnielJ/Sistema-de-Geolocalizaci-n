<?php
/*Archivo que contiene las consultas para obtener todos los registros de la db */

//Se llama al archivo database.php
include("database.php");

// Configuración de paginación

//Se define cuántos registros se mostrarán por página. 
//Si se recibe el parámetro limit por GET, se usa ese valor; si no, se usa 25 por defecto.
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 25;

//$page define el número de página actual. 
//Si se recibe el parámetro page, se usa ese valor; si no, se asume la primera página (1)
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1; 

//Calcula el desplazamiento (OFFSET) para la consulta SQL.
$offset = ($page - 1) * $limit;

//Si page = 1, entonces OFFSET = (1 - 1) * 25 = 0.
//Si page = 2, entonces OFFSET = (2 - 1) * 25 = 25.
//Esto permite cargar solo un conjunto específico de registros en cada solicitud.



// Consulta con paginación
//Se esta recuperando un número limitado de registros mediante limit y offset
$query = "SELECT * FROM viajes LIMIT $limit OFFSET $offset";
$result = mysqli_query($connection, $query);

//En caso de error, muere el proceso y manda mensaje de error
if(!$result) {
    die("Hubo un error en la consulta". mysqli_error($connection));
}

//Se llena un array con los datos de la consulta
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
        "valor" =>$row["valor"]
    );
}

// Se hace una consulta para obtener el número total de los registros
$totalQuery = "SELECT COUNT(*) as total FROM viajes";
$totalResult = mysqli_query($connection, $totalQuery);

//mysqli_fetch_assoc se utiliza para obtener el resultado
$totalRow = mysqli_fetch_assoc($totalResult);

//Se almacena el valor que viene en la consulta
$totalRecords = $totalRow['total'];

$totalPages = ceil($totalRecords / $limit);
//Se calcula el total de páginas dividiendo el total de registros entre el límite ($totalRecords / $limit) 
// y redondeando hacia arriba con ceil().

//Se crea un array el cual contiene la lista de los viajes($json),
//la cantidad total de páginas ($totalPages) y la 
//página actual ($page)
$response = array(
    'data' => $json,
    'totalPages' => $totalPages,
    'currentPage' => $page
);

//Se pasa a formato json la variable $response y se envia al metodo AJAX
echo json_encode($response);
?>
