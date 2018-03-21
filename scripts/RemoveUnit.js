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
  $('#RemoveUnit').prop('disabled', true);

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



console.log("Remove Unit pg");
$(document).ready(function(){
  $('#Error').hide();
  var airline = localStorage.getItem("Airline Name");
  //console.log(airline);
  document.getElementById("unit").innerHTML ="List of all Units in airline: " + airline;
  document.getElementById("unitList").innerHTML = "Loading Unit List...";

   console.log("[+] : " + __dirname);

      setTimeout(function(){
        var path = constants.API_CALLS.GET_AIRLINE_PATH + "\\"+ airline + "\\Checkin";
        //var path = './stored_airline' + airline + '/Checkin/';
        console.log(path);
    
        var unitList = ipcRenderer.sendSync(constants.API_CALLS.CURRENT_FOLDER_LIST, path);

        console.log(unitList);
        console.log("Printed out files");

      
       if (unitList == constants.API_ERROR.PATH_NOT_VALID) {
          displayError("Path is not valid!");
        } else if (unitList == constants.API_ERROR.EMPTY) {
          displayError("There's currently no files or folders under the current directory!")
        } else {
          displayOptions(unitList);
        }
    }, 1500);

      // functions to get the currently selected airline
  $('#list').change(function() {
    var selectedUnit = document.getElementById("list").value;
    console.log(selectedUnit);
  });
  
  $('#CancelButton').click(()=>{
       console.log("Cancel Remove unit, back to Unit mod pg");
       location.href = "UnitModifier.html";
    });

   $('#RemoveUnit').click(()=>{
       //console.log("Remove unit, on to edit/preview pg");
       
       //connect to server here, see if exists if not create,etc
       //var ans = true;
      console.log("Clicked remove Unit");
      // api called to see if the airline exists
      // api call to delete the airline if it does exist
      var unit = document.getElementById("list").value;
      var path = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airline + "\\Checkin";
      console.log(path);
      console.log("unit selected is: " + unit);
      // call the back end execution
        // connect to server here
      console.log(typeof unit);
      console.log(typeof path);
      var selection = document.getElementById("list").value;

      if(selection !== "-1"){
        $('#NoSelection').hide();
        let res = ipcRenderer.sendSync(constants.API_CALLS.REMOVE_UNIT, unit, path);
        handleResponse(res);

      if(res === "Remove Proceeded"){
          //localStorage.setItem("Unit Name", unit.value);
          console.log("Removed unit: " + unit);
          document.getElementById("Successful").innerHTML = ("Successfully removed Unit: " + unit);
          $('#Successful').show();
          $('#RU').hide();
          setTimeout(RemoveSuccessful, 3000);
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
  $('#RemoveUnit').prop('disabled', bool); // use prop to disable the button

  $(document).keyup(function() { // listen the keyup on the document or you can change to form in case if you have or you can try the closest div which contains the text inputs
    $('input:text').each(function() { // loop through each text inputs
      bool = $.trim(this.value) === "" ?  true :  false; // update the var bool with boolean values
      if(bool)
      return flag;
    });
    $('#RemoveUnit').prop('disabled', bool); // and apply the boolean here to enable
  });
});*/

function RemoveSuccessful(){
  location.href = "UnitModifier.html";
}