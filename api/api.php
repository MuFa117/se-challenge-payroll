<?php

require_once 'functions.php';

	$json = file_get_contents('php://input');
	$params = json_decode($json);

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers : Origin, X-Requested-With, Content-Type, Accept"); // X-Auth-Token
	// header("Access-Control-Allow-Credentials : true");
	header('Content-Type: text/plain; charset=UTF-8');

	// if API is in different server/path browsers first checks with 'OPTIONS' if they are allowed to connect (cross-origin issue),
	// in that case, there is no point of connecting to database etc.
	$action = isSet($_GET['action']) && $_SERVER['REQUEST_METHOD'] != 'OPTIONS' ? $_GET['action'] : 'promise'; 

	$api = new API($params);

	$response = $api->route($action);

	echo json_encode($response);

?>
