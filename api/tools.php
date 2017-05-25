<?php

function csvToArray($path){
	$dataRows = array();
	$toReturn = array();
	if (($handle = fopen($path, "r")) !== FALSE) {
	    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	    	$dataRows[] = $data;
	    }
	    fclose($handle);
	}
	$toReturn['header'] = $dataRows[0];
	if(count($dataRows) > 2){
		$toReturn['data'] = array_slice($dataRows, 1, -1);
	}
	$toReturn['reportID'] = end($dataRows)[1];
	return $toReturn;
}

// HELPERS: 
// taken from Drupal specs under GPL
// Returns a file size limit in bytes based on the PHP upload_max_filesize
// and post_max_size
function file_upload_max_size($_parsed = true) {
  static $max_size = -1;

  if ($max_size < 0) {
    // Start with post_max_size.
    $max_size = parse_size(ini_get('post_max_size'));
    $full_info = ini_get('post_max_size');

    // If upload_max_size is less, then reduce. Except if upload_max_size is
    // zero, which indicates no limit.
    $upload_max = parse_size(ini_get('upload_max_filesize'));
    if ($upload_max > 0 && $upload_max < $max_size) {
      $max_size = $upload_max;
   		$full_info = ini_get('upload_max_filesize');
    }
  }
  return ($_parsed) ? $max_size : array('bytes'=>$max_size, 'humanized'=>$full_info);
}
// taken from Drupal specs under GPL
function parse_size($size) {
  $unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
  $size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
  if ($unit) {
    // Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
    return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
  }
  else {
    return round($size);
  }
}

?>
