var {ipcRenderer, remote} = require('electron');
var fs = require('fs');
var path = require('path');
const main = remote.require('./main.js');
const $ = require('jquery');
//console.log("dir: " + __dirname);
//console.log("rgthgyjukhil: ", require('path').resolve(__dirname, 'constants.js'));
var constants = remote.require('./constants');

var PreviewPressed = false;
var ChangesMade = false;
var RevertPressed = false;

function handleResponse(val) {
     $("#Error").html("server responded with: " + val);
 }

$( document ).ready(function() {
    //$('#text').hide();
    //setup();
    $('#Error').hide();
    //$('#No').hide();
    $('#Yes').hide();
    $('.frame').css('background', 'Gray'); //sets the background color of the preview display to grey
    var unitOne = "2.json";
    var unitTwo = "3.json";
    var airlineName = localStorage.getItem("Airline Name");
    let res = ipcRenderer.sendSync(constants.API_CALLS.CREATE_BACKUP, airlineName, constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName);
    document.getElementById("AirlineHeader").innerHTML = "Edit JSONs for Airline: " + airlineName;
    document.getElementById("unitOne").innerHTML = unitOne;
    document.getElementById("unitTwo").innerHTML = unitTwo;
    document.getElementById("frame2").src = "http://localhost:8080?airline=" + airlineName +"&comp=Checkin&s=2";
    console.log(frame2.src);

    document.getElementById("frame3").src = "http://localhost:8080?airline=" + airlineName +"&comp=Checkin&s=3";
    console.log(frame3.src);
    //document.getElementById("text").rows = 20;
    //document.getElementById("text").cols = 50;

    console.log("Constants: " + constants.API_CALLS.GET_AIRLINE_PATH);

    var unitOnePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\" + unitOne;

    loadJSON(unitOnePath, "2");

    // do the same for 3.json..... fill form breaks it if in a function....
    var unitTwoPath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\" + unitTwo;

    loadJSON(unitTwoPath, "3");
 
    //console.log(Object.keys(b.Elements[1].textcontent).length);
    $('#html5colorpicker').change(()=>{
        clickColor(0, -1, -1, 5);        
    });
   
    $('#Cancel').click(()=>{
        console.log("Attempting to return to start");
        if(PreviewPressed === true || ChangesMade === true){
            console.log("user made changes so ask for confirmation");
            $('#P').hide();
            $('#BackgroundColor').hide();
            $('#html5colorpicker').hide();
            $('#confirm').show();
            $('#Yes').show();
            $('#No').show();
        }else{
            location.href= "Index.html";
        }
    });

    $('#Yes').click(()=>{
        console.log("User wants to save the changes");
        //delete the original backups
        var airlinePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\";
        let res = ipcRenderer.sendSync(constants.API_CALLS.DELETE_BACKUPS, airlinePath);
        console.log(res);
        document.getElementById("Successful").innerHTML = ("Successfully saved Unit: " + unitOne + " & " + unitTwo);
        $('#Successful').show();
        $('#confirm').hide();
        $('#Yes').hide();
        $('#No').hide();
        setTimeout(Save, 3000);
    });

    $('#No').click(()=>{
        console.log("User didn't want to save");
        //reset the json back to what it was
        var airlinePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\";
        let res = ipcRenderer.sendSync(constants.API_CALLS.REVERT_CHANGES, airlineName ,airlinePath);
        location.href = "Index.html";
    });

    $('#Revert').click(()=>{
        $('#Revert').prop('disabled',true);
        console.log("Revert changes was pressed");
        //2.json = 2.orignial
        //3.json = 3.original
        if(PreviewPressed === false && ChangesMade === false){ //no back up created
            //do nothing
            console.log("User never pressed preview changes so no changes have been made");
            $('#Revert').html("No changes");
            setTimeout(function(){$('#Revert').prop('disabled',false); $('#Revert').html("Revert to Original File");}, 1000);
        }
        else{ //preview was pressed so changes were made
            $('#Revert').html("Loading....");
            console.log("reseting jsons back to original");
            var airlinePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\";
            let res = ipcRenderer.sendSync(constants.API_CALLS.REVERT_CHANGES, airlineName ,airlinePath);
            $("#frame2").attr('src', $("#frame2").attr('src'));
            $("#frame3").attr('src', $("#frame3").attr('src'));

            // clear everything under div tag, which clears all elemnets
            var a = document.getElementById("a");
            var json2 = document.getElementById("json2");
            a.removeChild(json2);
            var newjson2 = document.createElement("div");
            newjson2.setAttribute("id", "json2");
            a.append(newjson2);

            $('br').remove();

            var b = document.getElementById("b");
            var json3 = document.getElementById("json3");
            b.removeChild(json3);
            var newjson3 = document.createElement("div");
            newjson3.setAttribute("id", "json3");
            b.append(newjson3);

            var unitOnePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\" + unitOne;

            loadJSON(unitOnePath, "2");

            // do the same for 3.json..... fill form breaks it if in a function....
            var unitTwoPath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\" + unitTwo;

            loadJSON(unitTwoPath, "3");

            ChangesMade = false;
            PreviewPressed = false;
            RevertPressed = true;
            setTimeout(function(){$('#Revert').prop('disabled',false); $('#Revert').html("Revert to Original File");}, 1000);
        }
    });
    
    $('#Done').click(()=>{
        console.log("save unit clicked with unit: " + unitOne + " " + unitTwo);
        //save unit
        var ans = true;
        if(ans === true){
            var airlinePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\";
            let res = ipcRenderer.sendSync(constants.API_CALLS.DELETE_BACKUPS, airlinePath);
            document.getElementById("Successful").innerHTML = ("Successfully saved Unit: " + unitOne + " & " + unitTwo);
            $('#Successful').show();
            $('#P').hide();
            $('#BackgroundColor').hide();
            $('#html5colorpicker').hide();
            setTimeout(Save, 3000);
        }else{
            document.getElementById("Successful").innerHTML = ("An error has occured");
             $('#Successful').show();
             $('#P').hide();
             $('#BackgroundColor').hide();
             $('#html5colorpicker').hide();
             setTimeout(displayError, 3000);
        }
    });

    /*$('#PreviewChanges').click(()=>{
        if(ChangesMade === true){
            let res = ipcRenderer.sendSync(constants.API_CALLS.CREATE_BACKUP, airlineName, constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName);
            handleResponse(res);
            if(res === "backed_up" || res === "Already_backed_up"){
                PreviewPressed = true;
                RevertPressed = false;
                ChangesMade = false;
                console.log("Preview Changes click with unit: "+ unitOne);
                console.log("Refreshing the iframe with the json + any updates");
                
                //will refresh the iframes based on their id and reload them hopefully with there changes
                $("#frame2").attr('src', $("#frame2").attr('src'));
                $("#frame3").attr('src', $("#frame3").attr('src'));
            //update the canvas with the file
            }else{
                console.log("Preview changes failed");
            }
        }
    });*/

});

function loadJSON(unitPath, unitID){
    let a = fs.readFileSync(unitPath);
    let b = JSON.parse(a);


    localStorage.setItem("json" + unitID, JSON.stringify(b));
    // console.log("unit ID is :" + unitID);
    // console.log(JSON.stringify(b));
    
    var numElements = (Object.keys(b.Elements).length);
    console.log("numElements" + numElements);

    // add element on webpage
    for (var i = 0; i < numElements; i++){
        // select the frame where stroes all json info
        var frame = document.getElementById("json" + unitID);

        var frameID = frame.id;

        // the detail section we will create
        // var detail = document.createElement("DETAILS"); 
        var detailID = frameID + "_" + (i + 1);

        // button id setting
        var buttonID = detailID + "_B";

        // add element drop down menu and update button 
        $( "#" + frameID ).append( "<div style = \"display: inline-flex;\"><details id=\"" + detailID + "\">" + "</details><button class= \"Work\" type=\"button\" onclick= \"removeElement("+ detailID +")\">Remove</button></div><br>");

        var summaryID = detailID + "_sum";
        if(b.Elements[i].textcontent.text !== ""){
        
            $( "#" + detailID  ).append( "<summary id = \"" + summaryID + "\"> " + b.Elements[i].textcontent.text  + " </summary>" );
        }
        else{
            $( "#" + detailID  ).append( "<summary id = \"" + summaryID + "\"> " + b.Elements[i].textcontent.formattingFunction + " " +b.Elements[i].textcontent.index + " </summary>" );
        }
        var formID = detailID + "_form";

        // add form
        $( "#" + detailID  ).append( "<form id = \"" + formID + "\"></summary>" );

        var jVal = "jVal" + unitID;

        // add json content
        for (var num in b.Elements[i]) {

            if (num === "textcontent") {    // see if the json file template is type 1 or 2
                
                // append "textcontent: {" if type 2
                $( "#" + formID ).append("textcontent: <br>");

                // append everything under textcontent element
                for (var c in b.Elements[i].textcontent) {

                    var inputID = c + unitID + "_" + (i+1);

                    // create input boxes
                    $( "#" + formID ).append(c + ": <input id=\"" + inputID 
                        + "\" type=\"text\" name = \"" + c + "\" oninput=\"writeToJson(" + inputID + ")\" ><br>");

                    // display the current json value
                    document.getElementById(inputID).value = b.Elements[i].textcontent[c];
                }
            } else{
                var inputID = num + unitID + "_" + (i+1);

                // create input boxes
                $( "#" + formID ).append(num + ": <input id=\"" + inputID 
                    + "\" type=\"text\" name = \"" + num + "\" oninput=\"writeToJson(" + inputID + ")\" ><br>");

                // display the current json value
                document.getElementById(inputID).value = b.Elements[i][num];
            }
            
        }
    }
}

function changeValue(key, value, unitID, elementID, fileDir) {
    if(alphanumeric(value) === true){

        var airlineName = localStorage.getItem("Airline Name");
        var airlinePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\";
        ipcRenderer.sendSync(constants.API_CALLS.CREATE_BACKUP, airlineName, constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName);
        console.log("current key is: " + key);
        console.log("current value is: " + value);
        console.log("current elementID is: " + elementID);
        // console.log(localStorage.getItem("json" + unitID));
        var json = JSON.parse(localStorage.getItem("json" + unitID));

        console.log(typeof json);

        // console.log(JSON.stringify(json));

        // if undefined, the current element inside is an array
        if (json.Elements[elementID - 1][key] == undefined) {
            console.log("Inside textcontent, original value is: " + json.Elements[elementID - 1].textcontent[key]);
            console.log("current value is: " + value);
            json.Elements[elementID - 1].textcontent[key] = value;
            console.log("Inside textcontent, the current value after editing is: " + json.Elements[elementID - 1].textcontent[key]);
        } else {
            console.log("original value is: " + json.Elements[elementID - 1][key]);
            console.log("current value is: " + value);
            json.Elements[elementID - 1][key] = value;
            console.log("the current value after editing is: " + json.Elements[elementID - 1][key]);
        }

        // format the current json object
        let temp = JSON.stringify(json,1,4);

        // let the server write to the original files
        let res = ipcRenderer.sendSync("save_json", temp, fileDir);
        localStorage.setItem("json" + unitID, temp);

        ChangesMade = true;
        $("#frame2").attr('src', $("#frame2").attr('src'));
        $("#frame3").attr('src', $("#frame3").attr('src'));
    }
}

function alphanumeric(inputtxt) { 
  var letters = /^[0-9a-zA-Z#_ ]+$/;
  if (letters.test(inputtxt)) {
    return true;
  } else {
    //alert('Please input alphanumeric characters only');
    return false;
  }
}

function addToJson(unitID) {

}

function reloadJSONS(unitID){
    var airlineName = localStorage.getItem("Airline Name");
    ipcRenderer.sendSync(constants.API_CALLS.CREATE_BACKUP, airlineName, constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName);
    console.log(unitID);

    var json = JSON.parse(localStorage.getItem("json" + unitID));
    let temp = JSON.stringify(json,1,4);
    var fileDir = __dirname + "\\WidgetImageGenerator\\json\\" + airlineName + "\\Checkin\\" + unitID + ".json";
        // let the server write to the original files
    let res = ipcRenderer.sendSync("save_json", temp, fileDir);
    //localStorage.setItem(unitID, temp);

    $("#frame2").attr('src', $("#frame2").attr('src'));
    $("#frame3").attr('src', $("#frame3").attr('src'));

        // clear everything under div tag, which clears all elemnets
    var a = document.getElementById("a");
    var json2 = document.getElementById("json2");
    a.removeChild(json2);
    var newjson2 = document.createElement("div");
    newjson2.setAttribute("id", "json2");
    a.append(newjson2);

    $('br').remove();

    var b = document.getElementById("b");
    var json3 = document.getElementById("json3");
    b.removeChild(json3);
    var newjson3 = document.createElement("div");
    newjson3.setAttribute("id", "json3");
    b.append(newjson3);

    var unitOnePath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\" + "2.json";

    loadJSON(unitOnePath, "2");

    // do the same for 3.json..... fill form breaks it if in a function....
    var unitTwoPath = constants.API_CALLS.GET_AIRLINE_PATH + "\\" + airlineName + "\\Checkin\\" + "3.json";

    loadJSON(unitTwoPath, "3");

    ChangesMade = true;
    PreviewPressed = false;
    RevertPressed = false;
}


function clickColor(hex, seltop, selleft, html5) {
    console.log("Changing background color");
    var cObj,c;
    c = document.getElementById("html5colorpicker").value;
    document.getElementById("colorhexDIV").innerHTML = c;
    $('.frame').css('background', c);
    /*var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawLine();
    //document.getElementById("colorhexDIV").innerHTML = cObj.toHexString();
    //document.getElementById("html5colorpicker").value = cObj.toHexString();*/  
}

function Save(){
    console.log("Save the files!");
    location.href = "Index.html";
}

function displayError(){
    $('#Successful').hide();
    $('#P').show();
    $('#BackgroundColor').show();
    $('#html5colorpicker').show();
}




/*var c, cObj, colormap, areas, i, areacolor, cc;
    if (html5 && html5 == 5)  {
        c = document.getElementById("html5colorpicker").value;
    } else {
        if (hex == 0)  {
            c = document.getElementById("entercolor").value;
        } else {
            c = hex;
        }
    }
    cObj = w3color(c);
    colorhex = cObj.toHexString();
    r = cObj.red;
    g = cObj.green;
    b = cObj.blue; */



 