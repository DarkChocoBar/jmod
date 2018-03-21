var {ipcRenderer, remote} = require('electron');
var fs = require('fs');
var path = require('path');
const main = remote.require('./main.js');
const $ = require('jquery');
const constants = require('../constants');

console.log("Create Airline pg");

function handleResponse(val) {
     $("#Error").html("server responded with: " + val);
 }
 
 function displayError(val) {
  $("#airlineList").hide();
 
  $("#Error").html("server responded with: " + val);
 
  $("#Error").show();
 }


$( document ).ready(function() {

	$('#Error').hide();
  $('#Successful').hide();
  var airpath = constants.API_CALLS.GET_AIRLINE_PATH;
  var airlineList = ipcRenderer.sendSync(constants.API_CALLS.CURRENT_FOLDER_LIST, airpath);
  var cleanList="";
  for(var a in airlineList){
      cleanList += airlineList[a] +"<br>";
    }
    document.getElementById("airlineList").innerHTML = cleanList;
  

  if (!airlineList) {
    //
  } else if (airlineList == constants.API_ERROR.PATH_NOT_VALID) {
    displayError("Path is not valid!");
    $('#CreateAirlineButton').prop('disabled', true);
  } else if (airlineList == constants.API_ERROR.EMPTY) {
    displayError("There's currently no files or folders under the current directory!");
  } 
  

    //document.getElementById("airlineList").innerHTML = services.getAirlineList();

    $('#CancelButton').click(()=>{
      console.log("Cancel Create Airline, back to home page");
      location.href = "Index.html";
    });

    $('#CreateAirlineButton').click(()=>{
    //not sure how to pass the txt_CreateAirline as a parameter in ES6
    var airline = document.getElementById("txt_CreateAirline");
    
    //var path = constants.API_CALLS.GET_AIRLINE_PATH;
    
    console.log("Clicked Create Airline and passed in: " + airline.value);
    

    // call the back end execution
    // connect to server here
    console.log(typeof airline);
    console.log(typeof airpath);
    
    let val = $("#txt_CreateAirline").val();
    console.log(val);
    
    //let res = ipcRenderer.sendSync(constants.API_CALLS.SAVE_AIRLINE, val);
    //path = "//home//benjamin//Desktop//JMOD_Kevin//" + val;
    console.log(airpath);
    console.log(fs.existsSync(airpath));
    //path = "//home//benjamin//Desktop//JMOD_Kevin//" + val;
    let res = ipcRenderer.sendSync(constants.API_CALLS.SAVE_AIRLINE, val,airlineList,airpath);
    handleResponse(res);

    if(res === "Created Airline"){
      var code = $('#CreateAirline_Code').val();
      //have to add delay inorder to let time for the file to be created. other wise it fails?
      setTimeout(help, 3000);
      //addCode(airpath, val, code);
      localStorage.setItem("Airline Name",airline.value);
      console.log("Successfully created airline: " + airline.value);
      document.getElementById("Successful").innerHTML = ("Successfully created Airline: " + airline.value);
      //alert("Successfully created airline: " + airline.value);
      $('#Successful').show();
      $('#CRA').hide();
      setTimeout(CreateSuccessful, 3000);
    }
    else {
      $('#Error').show();
    }
  });
});

function help(){
  var airpath = constants.API_CALLS.GET_AIRLINE_PATH;
  var code = $('#CreateAirline_Code').val();
  let val = $("#txt_CreateAirline").val();
  addCode(airpath,val,code);
}

function CreateSuccessful(){
  location.href = "Preview.html";
}

function addCode(airpath, val, code){
  console.log(airpath + "\\" + val+"\\Checkin\\2.json");

  let obj = fs.readFileSync(airpath + '\\' + val+'\\Checkin\\2.json');
  let jobj = JSON.parse(obj);
  //let jobj = require(path2);
  jobj.Sources[0].url = "/api/GoaaFid/GetXNextFlightsOfAirlineXWithCutoff/" + code +"/4/2/Departing";
  let json2 = JSON.stringify(jobj,1, 4);
  fs.writeFileSync(airpath + "\\" + val+"\\Checkin\\2.json", json2);


  let js2 = fs.readFileSync(airpath + '\\' + val+'\\Checkin\\3.json');
  let jobj2 = JSON.parse(js2);

  jobj2.Sources[0].url = "/api/GoaaFid/GetXNextFlightsOfAirlineXWithCutoff/" + code +"/4/2/Departing";
  let json3 = JSON.stringify(jobj2,1,4);
  fs.writeFileSync(airpath + "\\" + val+"\\Checkin\\3.json", json3);
}


$(function() {
  var bool = true, flag = false;
  $('#CreateAirlineButton').prop('disabled', bool); // use prop to disable the button
  $('#CreateAirline_Code').prop('enable',bool);
  $(document).keyup(function() { // listen the keyup on the document or you can change to form in case if you have or you can try the closest div which contains the text inputs
    $('input:text').each(function() { // loop through each text inputs
      bool = $.trim(this.value) === "" ?  true :  false; // update the var bool with boolean values
      if(bool)
      return flag;
    });
    $('#CreateAirlineButton').prop('disabled', bool); // and apply the boolean here to enable
    $('#CreateAirline_Code').prop('enable',bool);
  });
});


/*
function Cancel(){
	 location.href = "Welcomepg.html"
}

function CreateAirline(txt_CreateAirline){
	console.log(txt_CreateAirline.value);
	//var ans = services.CreateAirline(txt_CreateAirline.value);
    var ans = true;
	
	if(ans === true){
		localStorage.setItem("Airline Name",txt_CreateAirline.value);
    alert("Successfully created airline: " + txt_CreateAirline.value);
		location.href = "UnitModifier.html"
	}
	else {
		$('#Error').show();
	}
}
*/
/*  Regex for later for only valid input
$(":input").each(function(){
    var input = $(this).val();
    var regex = new RegExp("^[a-zA-Z]+$");
    if(regex.test(input)) {
        alert("true");
    }else {
        alert("false");
        return false;
    }
});


*/