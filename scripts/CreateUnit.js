var {ipcRenderer, remote} = require('electron');
var fs = require('fs');
var path = require('path');
const main = remote.require('./main.js');
const $ = require('jquery');
const constants = require('../constants');

console.log("Create Airline pg")

function handleResponse(val) {
    $("#Error").html("server responded with: " + val);
}

 function displayError(val) {
  $("#unitList").hide();
 
  $("#Error").html("server responded with: " + val);
 
  $("#Error").show();
  $('#CreateUnitButton').prop('disabled', true);
  console.log("disable damn you");
 }

console.log("Create Unit pg");
$(document).ready(function(){
  $('#Error').hide();
  $('#Successful').hide();
  var airline = localStorage.getItem("Airline Name");
  var path = constants.API_CALLS.GET_AIRLINE_PATH;
  console.log(path);
  path = path + "\\"+airline+"\\Checkin";
  console.log(path);
  var unitlist = ipcRenderer.sendSync(constants.API_CALLS.CURRENT_FOLDER_LIST, path);
  //console.log(unitlist);
  document.getElementById("unit").innerHTML ="List of all Units in airline: " + airline;
  document.getElementById("unitList").innerHTML = unitlist;
  

   if (!unitlist) {
    
  } else if (unitlist == constants.API_ERROR.PATH_NOT_VALID) {
    console.log('Booo!');
    displayError("Path is not valid!");
  } else if (unitlist == constants.API_ERROR.EMPTY) {
    console.log('Booodfghjk!');
    displayError("There's currently no files or folders under the current directory!")
  }

  $('#CancelButton').click(()=>{
       console.log("Cancel Create unit, back to Unit mod pg");
       location.href = "UnitModifier.html";
    });

   $('#CreateUnitButton').click(()=>{
       console.log("Create unit, on to edit/preview pg");
       let val = $("#txt_CreateUnit").val();
       if(val !== ""){
          console.log(val);
         
         //connect to server here, see if exists if not create,etc
         console.log(path);
         var res = ipcRenderer.sendSync(constants.API_CALLS.SAVE_UNIT, val, path);
         handleResponse(res);

        if(res === "Created Unit"){
            localStorage.setItem("Unit Name", val + ".json");
            document.getElementById("Successful").innerHTML = ("Successfully created Unit: " + val);
            $('#Successful').show();
            $('#CU').hide();
            setTimeout(CreateSuccessful, 3000);
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
  $('#CreateUnitButton').prop('disabled', bool); // use prop to disable the button

  $(document).keyup(function() { // listen the keyup on the document or you can change to form in case if you have or you can try the closest div which contains the text inputs
    $('input:text').each(function() { // loop through each text inputs
      bool = $.trim(this.value) === "" ?  true :  false; // update the var bool with boolean values
      if(bool)
      return flag;
    });
    $('#CreateUnitButton').prop('disabled', bool); // and apply the boolean here to enable
  });
});*/

function CreateSuccessful(){
  location.href = "Preview.html";
}