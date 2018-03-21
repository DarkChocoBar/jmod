var {ipcRenderer, remote} = require('electron');
const main = remote.require('./main.js');
const $ = require('jquery');
const constants = require('../constants');

$( document ).ready(function() {
	var airline = localStorage.getItem("Airline Name");
	console.log(airline);
	document.getElementById("Airlines").innerHTML = airline;

	$('#CreateUnitButton').click(()=>{
	  		console.log("Unit mod pg to create unit");
	  		location.href = "CreateUnit.html";
	  });

	$('#EditUnitButton').click(()=>{
	  		console.log("Unit mod pg to edit unit");
	  		location.href = "EditUnit.html";
	  });

	$('#RemoveUnitButton').click(()=>{
	  		console.log("Unit mod pg to Remove Unit");
	  		location.href = "RemoveUnit.html";
	  });

	$('#BackToIndexpg').click(()=>{
		location.href= "Index.html";
	});

});	


/*
function CU()
{
 	location.href = "CreateUnit.html"
}


function EU()
{
	location.href = "EditUnit.html"
}


function RA()
{
	location.href = "RemoveAirline.html"
}
*/