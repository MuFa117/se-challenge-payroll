<?php

require_once 'config.php';
require_once 'tools.php';

class Result {}

class API{
	private $params;

	// create database connection 
	function __construct($_params){
		$this->params = $_params;
		// don't connect to DB, just yet. Do it once proper action verified
	}

	function route($_action = 'promise'){
		$dataToReturn = new Result();
		switch($_action){
			case 'UploadNewReport':
				$dataToReturn->data = $this->UploadNewReport();
			break;
			case 'GetMaxUploadSize':
				$dataToReturn->data = $this->GetMaxUploadSize();
			break;
			case 'GetReportData':
				$dataToReturn->data = $this->GetReportData();
			break;
			default: 
				$dataToReturn->promise = true;
			break;
		}
		if(DEBUG_MODE){
			$dataToReturn->debug = new Result();
			$dataToReturn->debug->params = $this->params;
			$dataToReturn->debug->server = $_SERVER;
			$dataToReturn->debug->get = $_GET;
			$dataToReturn->debug->request = $_REQUEST;
		}

		return $dataToReturn;
	}

	function GetMaxUploadSize(){
		return file_upload_max_size(false);
	}

	function UploadNewReport(){
		$db = $this->DBConnect();
		$dataToReturn = new Result();
		$dataToReturn->message = 'UDEFINED ERROR';

		if($_FILES){
			// upload file
			$uploaddir = "tmp/";
			$uploadfile = $uploaddir.basename( $_FILES['userfile']['name']);
			$dataToReturn->status = move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile);
			$dataToReturn->originalname = $_FILES['userfile']['name'];

			// insert new data to database, check if report exists
			$insertDataToDB = $this->InsertNewReportToDB($db, $uploadfile);
			$dataToReturn->status = $insertDataToDB->status;
			$dataToReturn->message = $insertDataToDB->message;
			if($insertDataToDB->status){
				$dataToReturn->newReport = $this->GetReportData();
				unlink($uploadfile); // data are already in the DB, so remove file (unless for backup purposes). Keep the file if file wasn't inserted to DB
			}
		} else {
			$dataToReturn->status = false;
			$dataToReturn->message = 'No file uploaded.';
		}
		
		return $dataToReturn;
	}

	function InsertNewReportToDB($db, $_filename){
		$newData = csvToArray($_filename);
		$dataToReturn = new Result();

		// check if report already exist 
		// this could be separeted in future, to have 'reports' table
		$q = 'SELECT * FROM hours WHERE reportID = :reportID';
		$stmt = $db->prepare($q);
		$stmt->bindParam(':reportID', $newData['reportID']);
		$stmt->execute();
		$report = $stmt->fetch(PDO::FETCH_ASSOC);


		if($report == null){
			$sql = 'INSERT INTO hours (trackedDate, amount, employeeID, jobGroup, reportID) VALUES ';
			$insertQuery = array();
			$insertData = array();
			$n = 0;
			foreach ($newData['data'] as $row) {
			    $insertQuery[] = '(:trackedDate'.$n.', :amount'.$n.', :employeeID'.$n.', :jobGroup'.$n.', :reportID'.$n.')';
			    $insertData['trackedDate'.$n] = DateTime::createFromFormat('d/m/Y', $row[0])->format('Y-m-d');; // $row[0];
			    $insertData['amount'.$n] = $row[1];
			    $insertData['employeeID'.$n] = $row[2];
			    $insertData['jobGroup'.$n] = $row[3];
			    $insertData['reportID'.$n] = $newData['reportID'];
			    $n++;
			}

			// print_r($insertQuery);
			// print_r($insertData);

			if (!empty($insertQuery)) {
			    $sql .= implode(', ', $insertQuery);
			    $stmt = $db->prepare($sql);
			    $stmt->execute($insertData);
			}
			// echo $sql;
			$dataToReturn->status = true;
			$dataToReturn->message = 'FILE UPLOADED';
		} else {
			$dataToReturn->status = false;
			$dataToReturn->message = 'Report with this ID has been already uploaded.';
		}
		return $dataToReturn;
	}

	function DBConnect(){
	    $db = new PDO('mysql:host='.DATABASE_HOST.';',DATABASE_USERNAME,DATABASE_PASSWORD);
	    $db->exec("set names utf8"); // small trick for characters.
	    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $db->exec('use `'.DATABASE_NAME.'`');
	    return $db;
	}

	// get full report
	function GetReportData(){
		$db = $this->DBConnect();
		$dataToReturn = new Result();
		$dataToReturn->data = array();

		$query = "SELECT 
					employeeID, YEAR(trackedDate) as Year, MONTH(trackedDate) as Month, (
						CASE 
							WHEN DAY(trackedDate) < 16 then CONCAT('1/', MONTH(trackedDate), '/', YEAR(trackedDate), '/', ' - 15/', MONTH(trackedDate), '/', YEAR(trackedDate))
						else 
							CONCAT('16/', MONTH(trackedDate), '/', YEAR(trackedDate), '/', ' - ', DAY(last_day(trackedDate)), '/', MONTH(trackedDate), '/', YEAR(trackedDate)) end) as PayPeriod,
					SUM(amount) as HoursWorked,
					(CASE	
						WHEN jobGroup = 'A' THEN SUM(amount)*:RateA
						WHEN jobGroup = 'B' THEN SUM(amount)*:RateB
					END
					) as Paid
				FROM hours
				GROUP BY employeeID, Year, Month, PayPeriod
				ORDER by employeeID, Year, Month, PayPeriod";
		$stmt = $db->prepare($query);
		$rateA = RATE_A; // PDO requires to use variables
		$rateB = RATE_B;
		$stmt->bindParam(':RateA', $rateA);
		$stmt->bindParam(':RateB', $rateB);
		$stmt->execute();
		while($tmp = $stmt->fetch(PDO::FETCH_ASSOC)){
			$dataToReturn->data[] = $tmp;
		}
		return $dataToReturn;
	}

}

?>
