<?php
$config_api = array (
    "addres" => "localhost",
    "base" => "name_base",
    "user" => "root",
    "password" => "password",
    "key" => "00001",
);

if ($_GET["key"] == $config_api["key"]) {
    $conn = mysqli_connect($config_api["addres"], $config_api["user"], $config_api["password"], $config_api["base"]);
    if ($_GET["a"] == "check") {
        $sql = "SELECT * FROM user WHERE user_id=".$_GET["user"];
        $result = mysqli_query($conn, $sql);
        $array = mysqli_fetch_assoc($result);
        if ($_GET["user"] == $array["user_id"]) {
            $json_array["status"] = 1; 
        } else {
            $json_array["status"] = 0; 
        }
	echo json_encode($json_array);
    } elseif ($_GET["a"] == "add") {
        $sql = "SELECT * FROM user WHERE user_id=".$_GET["user"];
        $result = mysqli_query($conn, $sql);
        $array = mysqli_fetch_assoc($result);
        if ($_GET["user"] == $array["user_id"]) {
            $json_array["status"] = 3; 
        } else {
            $userdiscord = $_GET["user"];
            $add = "INSERT INTO user (user_id)VALUES ('".$userdiscord."')";
            if ($conn->query($add) === TRUE) {
                    $json_array["status"] = 1; 
            } else {
                    $json_array["status"] = 0; 
            }
            $conn->close();
            //echo json_encode($json_array);
        }
	echo json_encode($json_array);
    } elseif ($_GET["a"] == "status") {
	$server_count = $_GET["server"];
	$sql = "UPDATE data SET value='".$server_count."' WHERE argument='server'";
        if ($conn->query($sql) === TRUE) {
            $json_array["status"] = 1;
        } else {
            $json_array["status"] = 0;
        }
        echo json_encode($json_array);

    } elseif ($_GET["a"] == "server") {
        $server_id = $_GET["id"];
        $sql = "SELECT * FROM server WHERE server_id=".$server_id;
        $result = mysqli_query($conn, $sql);
        $array = mysqli_fetch_assoc($result);
        if ($_GET["id"] == $array["server_id"]) {
            $json_array["status"] = 3; 
        } else {
            $add = "INSERT INTO server (server_id)VALUES ('".$server_id."')";
            if ($conn->query($add) === TRUE) {
                    $json_array["status"] = 1; 
            } else {
                    $json_array["status"] = 0; 
            }
            $conn->close();
        }
	    echo json_encode($json_array);
    } elseif ($_GET["a"] == "server_check") {
        $sql = "SELECT * FROM server WHERE server_id=".$_GET["id"];
        $result = mysqli_query($conn, $sql);
        $array = mysqli_fetch_assoc($result);
        if ($_GET["id"] == $array["server_id"]) {
            $json_array["status"] = 1; 
        } else {
            $json_array["status"] = 0; 
        }
	    echo json_encode($json_array);
    } elseif ($_GET["a"] == "analytics") {
        $time_today = time();
        $server_id = $_GET["server_id"];
        $type = $_GET["type"];

        $add = "INSERT INTO analytics (type, time, server_id)VALUES ('".$type."', '".$time_today."', '".$server_id."')";
        if ($conn->query($add) === TRUE) {
                $json_array["status"] = 1; 
        } else {
                $json_array["status"] = 0; 
        }
        $conn->close();
    }
}
?>
