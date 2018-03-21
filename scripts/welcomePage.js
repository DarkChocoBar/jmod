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

console.log("loaded");
$( document ).ready(function() {
	//var AirlineList = services.getAirlineList();
	//document.getElementById("airlineList").innerHTML = AirlineList;
	var path = constants.API_CALLS.GET_AIRLINE_PATH;
	var airlineList = ipcRenderer.sendSync(constants.API_CALLS.CURRENT_FOLDER_LIST, path);
	var cleanList="";
	for(var a in airlineList){
		cleanList += airlineList[a] + "<br>";
	}
	console.log(cleanList);
	document.getElementById("airlineList").innerHTML = cleanList;

	$("#CreateAirlineButton").click(() => {
		console.log("CreateAirlineButton from Index pg");
		location.href = "CreateAirline.html"
	});

	$("#EditAirlineButton").click(() => {
		console.log("EditAirlineButton from Index pg");
		location.href = "EditAirline.html"
	});

	$("#RemoveAirlineButton").click(() => {
		console.log("RemoveAirlineButton from Index pg");
		location.href = "RemoveAirline.html"
	});
});

