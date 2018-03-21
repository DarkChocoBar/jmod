var {ipcRenderer, remote} = require('electron');
var fs = require('fs');
var path = require('path');
const main = remote.require('./main.js');
const $ = require('jquery');
const constants = require('../constants');


function handleResponse(val) {
    $("#Error").html("server responded with: " + val);
}
 function displayError(val) {
  $("#unitList").hide();
 
  $("#Error").html("server responded with: " + val);
 
  $("#Error").show();
  $('#EditUnit').prop('disabled', true);

 }
function displayOptions(val) {
  // hide the airline list prompt 
  $("#unitList").hide();

  // check the passed-in parameter
  console.log(val);

  // select the "select" object in the page
  var x = document.getElementById("list");

  // add options into the "select" object
  for (var optionIndex in val) {
    console.log(optionIndex);
    temp = document.createElement("option");
    temp.text = val[optionIndex];
    x.add(temp);
  }
  
  // display the "select" object
  $("#list").show();
}


console.log("Edit unit pg")
$( document ).ready(function() {
  $('#Error').hide();
  $('#Successful').hide();
  var airline = localStorage.getItem("Airline Name");
  //console.log(airline);
  document.getElementById("unit").innerHTML ="List of all Units in airline: " + airline;
  document.getElementById("unitList").innerHTML = "Loading Unit List ...";

  console.log("[+] : " + __dirname);

  setTimeout(function(){
        var path = constants.API_CALLS.GET_AIRLINE_PATH + "\\"+ airline + "\\Checkin";
        console.log(path);
    
        var unitList = ipcRenderer.sendSync(constants.API_CALLS.CURRENT_FOLDER_LIST, path);

        console.log(unitList);

        if (unitList == constants.API_ERROR.PATH_NOT_VALID) {
          displayError("Path is not valid!");
        } else if (unitList == constants.API_ERROR.EMPTY) {
          displayError("There's currently no files or folders under the current directory!")
        } else {
          displayOptions(unitList);
        }
    }, 1500);

        // functions to get the currently selected unit
    $('#list').change(function() {
      var selectedUnit = document.getElementById("list").value;
      console.log(selectedUnit);
    });
  
  $('#CancelButton').click(()=>{
       console.log("Cancel Edit unit, back to Unit mod pg");
       location.href = "UnitModifier.html";
    });

   $('#EditUnitButton').click(()=>{
       console.log("Edit unit, on to edit/preview pg");
       //var unit = document.getElementById("txt_EditUnit");
       //connect to server here, see if exists if not create,etc
       var unit = document.getElementById("list").value;
       var path = constants.API_CALLS.GET_AIRLINE_PATH + "\\" +airline+ "\\Checkin";
       console.log("unit selected is: " + unit);

       console.log(typeof unit);
       console.log(typeof path);

        if(unit !== "-1"){
          $('#NoSelection').hide();
          let res = ipcRenderer.sendSync(constants.API_CALLS.EDIT_UNIT, unit, path);
          handleResponse(res);
          if(res === "NOTHING"){
            console.log("Editting unit = " + unit);
            localStorage.setItem("Unit Name", unit);
            document.getElementById("Successful").innerHTML = ("Successfully loaded Unit: " + unit);
            $('#Successful').show();
            $('#EU').hide();
            setTimeout(Successful, 3000);
          }
          else{
            $('#Error').show();
          }
        }
    });
});

/*
$(function() {
  var bool = true, flag = false;
  $('#EditUnitButton').prop('disabled', bool); // use prop to disable the button

  $(document).keyup(function() { // listen the keyup on the document or you can change to form in case if you have or you can try the closest div which contains the text inputs
    $('input:text').each(function() { // loop through each text inputs
      bool = $.trim(this.value) === "" ?  true :  false; // update the var bool with boolean values
      if(bool)
      return flag;
    });
    $('#EditUnitButton').prop('disabled', bool); // and apply the boolean here to enable
  });
});*/

function Successful(){
  location.href = "Preview.html";
}