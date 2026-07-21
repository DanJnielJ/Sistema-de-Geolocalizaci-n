<?php

/*En este archivo esta la conexión a la base de datos (el contenido depende de la forma en que se haga la conexión)
Este archivo debe ser llamado cada vez que se quiera hacer una consulta a la base de datos*/

//Línea de conexión con la base de datos transportes en MYSQL

$connection = mysqli_connect("localhost", "root", "root123", "transportes");

//Se le debe pasar la dirección ip en donde se esta ejecuntando MYSQL (en este caso, se dejo como localhost)
//Se le pasa el usuario y contraseña que tienen acceso a la base de datos (se dejaron por defecto)
//usuario = root y la contraseña es vacía("")
//Por último esta el nombre de la base de datos, que en este caso es transportes