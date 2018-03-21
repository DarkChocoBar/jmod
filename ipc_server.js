const fs = require('fs');
const path =  require('path');
const ipcMain = require('electron').ipcMain;
const fileName = "test_file.txt";
const constants = require('./constants');
const $ = require('jquery');
const rimraf = require('rimraf');

// Listen for async message from renderer process
ipcMain.on(constants.API_CALLS.ASYNC, (event, arg) => {
    // Reply on async message from renderer process
    event.sender.send('async-reply', ++arg);
});

// Listen for sync message from renderer process
ipcMain.on(constants.API_CALLS.SYNC, (event, arg) => {
    event.returnValue = ++arg;
});

ipcMain.on(constants.API_CALLS.SAVE_FILE, (event, arg) => {
    let response = "The file has been saved!";

    try {
        fs.writeFileSync(fileName, arg, 'utf8');
    }
    catch (e) {
        response = "something went wrong..";
    }

    event.returnValue = response;
});

ipcMain.on(constants.API_CALLS.SAVE_JSON, (event, jsonText, path) => {
    let response = "The json file has been saved!";

    try {
        // console.log(jsonText);
        console.log(path);
        fs.writeFileSync(path, jsonText);
    }
    catch (e) {
        response = "something went wrong..";
    }

    event.returnValue = response;
});

//Create an Airline
ipcMain.on(constants.API_CALLS.SAVE_AIRLINE, (event, airline, currentAirlines ,airlinePath) => {
    // arg here is the airline name from the text input field

    let response = "Airline already exits";
    var curPath;

    if (fs.existsSync(airlinePath))
    {
        newFolderPath = airlinePath + "/" + airline;
        //console.log(            fs.lstatSync(curPath).isDirectory());
        
        //if (!fs.lstatSync(newFolderPath).isDirectory())
        //{


        //dont want to allow similar airlines names
        if (!fs.existsSync(newFolderPath))
        {
            fs.mkdirSync(newFolderPath);
            newFolderPath = newFolderPath + "/Checkin";
            fs.mkdirSync(newFolderPath);
            
            var oneJson = '2.json';
            var source = fs.createReadStream(constants.API_CALLS.GET_DEFAULT_PATH2);
            var test = path.resolve(newFolderPath, oneJson);
            // console.log(test);
            var dest = fs.createWriteStream(test);
            source.pipe(dest);


            var twoJson = '3.json';
            var sourceTwo = fs.createReadStream(constants.API_CALLS.GET_DEFAULT_PATH3);
            var testTwo = path.resolve(newFolderPath, twoJson);
            // console.log(testTwo);
            var destTwo = fs.createWriteStream(testTwo);
            sourceTwo.pipe(destTwo);
            response = "Created Airline"
            
        }
        //}
    }
    event.returnValue = response;    
});

ipcMain.on(constants.API_CALLS.CREATE_BACKUP, (event, airline, airlinePath)=>{
    let response = "NOT_BACKED_UP";
    console.log("path =" + airlinePath);
    if(fs.existsSync(airlinePath)){
        var airpath = airlinePath + "/Checkin";
        if(!(fs.existsSync(airpath + "/2.original.json")) && !(fs.existsSync(airpath + "/3.orginal.json"))){
            //back up 2.json
            var backup2 = "2.original.json";
            var source = fs.createReadStream(airpath+"/2.json");
            var helper = path.resolve(airpath, backup2);
            var save = fs.createWriteStream(helper);
            source.pipe(save);
        
            //back up 3.json
            var backup3 = "3.original.json";
            var source3 = fs.createReadStream(airpath + "/3.json");
            var helper3 = path.resolve(airpath, backup3);
            var save3 = fs.createWriteStream(helper3);
            source3.pipe(save3);
            response = "backed_up";
        }
        else{
            response = "Already_backed_up";
        }
    }
    event.returnValue = response;
});


ipcMain.on(constants.API_CALLS.REVERT_CHANGES, (event, airlineName,airlinePath)=>{
    let response = "ERROR";
    // console.log("Reverting changes to airline:" + airlineName);
    var airPath = airlinePath;
    if(fs.existsSync(airPath)){
        //check to see if all of the files exist
        if((fs.existsSync(airPath + "\\2.original.json")) &&
            (fs.existsSync(airPath + "\\3.original.json"))&&
            (fs.existsSync(airPath + "\\2.json"))&&
            (fs.existsSync(airPath + "\\3.json"))){
                // console.log("All files exisit!");
                //delete the 2/3.json so they can be created back to the orginals
                rimraf.sync(airPath + "\\2.json");
                rimraf.sync(airPath + "\\3.json");
                //check to make sure they got deleted
                if(!(fs.existsSync(airPath+ "\\2.json")) && !(fs.existsSync(airPath + "\\3.json"))){
                    //re create 2/3.json using the originals
                    // console.log("re-creating the 2/3.json back to original values");
                    //2.json
                    var recreate2 = "2.json";
                    var source = fs.createReadStream(airPath+"\\2.original.json");
                    var helper = path.resolve(airPath, recreate2);
                    var save = fs.createWriteStream(helper);
                    source.pipe(save);
                    //3.json
                    var recreate3 = "3.json";
                    var source2 = fs.createReadStream(airPath+"\\3.original.json");
                    var helper2 = path.resolve(airPath, recreate3);
                    var save2 = fs.createWriteStream(helper2);
                    source2.pipe(save2);
                }
                //check to make sure they were created
                if((fs.existsSync(airPath + "\\2.json")) && (fs.existsSync(airPath + "\\3.json"))){
                    //check to make sure the originals still exisit
                    if((fs.existsSync(airPath + "\\2.original.json")) &&
                        (fs.existsSync(airPath + "\\3.original.json"))){
                        // console.log("Deleting original backups");
                        //delete them
                        rimraf.sync(airPath + "\\2.original.json");
                        rimraf.sync(airPath + "\\3.original.json");
                    }
                }
                response = "Reverted";
        }
    }
    event.returnValue = response; 
});

//Create an unit
ipcMain.on(constants.API_CALLS.SAVE_UNIT, (event, unit, unitPath) => {
    // arg here is the airline name from the text input field

    let response = "Error Message";
    var curPath = unitPath;

    if (fs.existsSync(unitPath))
    {
        curPath = unitPath + "\\" + unit+".json";
        console.log(curPath);
        //console.log(            fs.lstatSync(curPath).isDirectory());
        
        //if (!fs.lstatSync(newFolderPath).isDirectory())
        //{
        response = "Unit already exists!"
        if (!fs.existsSync(curPath))
        {
            
            var oneJson = unit + ".json";
            var source = fs.createReadStream(constants.API_CALLS.GET_DEFAULT_PATH2);
            var test = path.resolve(unitPath, oneJson);
            console.log(test);
            var dest = fs.createWriteStream(test);
            source.pipe(dest);

            response = "Created Unit"
            
        }

        //}
    }
    event.returnValue = response;    
});

// edit airline will currently only check to see if the airline exists
// later will add the ability to rename the airline to something else
ipcMain.on(constants.API_CALLS.EDIT_AIRLINE, (event, airline, path) => {

    // arg here is the airline name from the text input field

    // event.returnValue = true;
    event.returnValue = "NOTHING";      
});

ipcMain.on(constants.API_CALLS.EDIT_UNIT, (event, unit, arg) => {
    // arg here is the airline name from the text input field

    event.returnValue = "NOTHING";
    // event.returnValue = "EDIT FAILED";      
});

ipcMain.on(constants.API_CALLS.REMOVE_AIRLINE, (event, airline, path) => {
    // arg here is the airline name from the text input field
    let response = "Error Message";
    var curPath;
    if (fs.existsSync(path)) {
            curPath = path + "/" + airline;
            console.log(            fs.lstatSync(curPath).isDirectory());
            console.log(            curPath);
            if (fs.lstatSync(curPath).isDirectory()) {
                //fs.rmdirSync(curPath);
                rimraf.sync(curPath);
                response = "Remove Proceeded";
            }
    }
    // event.returnValue = true;
    event.returnValue = response;      
});

ipcMain.on(constants.API_CALLS.REMOVE_UNIT, (event, unit, path) => {
    // arg here is the airline name from the text input field
    let response = "Error Message";
    var curPath;
    console.log(path);
    if (fs.existsSync(path)) {
            curPath = path + "/" + unit;
            //console.log(            fs.lstatSync(curPath).isDirectory());
            console.log(            curPath);
            //if (fs.lstatSync(curPath).isDirectory()) {
                //fs.rmdirSync(curPath);
                rimraf.sync(curPath);
                response = "Remove Proceeded";
            //}
    }
    // event.returnValue = true;
    event.returnValue = response;      
});

ipcMain.on(constants.API_CALLS.CURRENT_FOLDER_LIST, (event, path) => {
    let response = "error messages";
    try {
        response = fs.readdirSync(path);
        if (response.length == 0) {
            response = "NO_FILE";
        }
    }
    catch (e) {
        // this line here has a problem
        // $(document).getElementByID("airlineList").style.color = "red";
        response = "Path is not valid!";
    }

    event.returnValue = response;
})

// ipcMain.on(constants.API_CALLS.LOAD_JSON, (event, a, b) => {
//     let response = "Error";

//     var numElements = (Object.keys(b.Elements).length);

//     // add element on webpage
//     for (var i = 0; i < numElements; i++){
//         // select the frame where stroes all json info
//         var frame = document.getElementById("json");

//         var frameID = frame.id;
//         // console.log(frameID);

//         // the detail section we will create
//         // var detail = document.createElement("DETAILS"); 
//         var detailID = frameID + "_" + (i + 1);
//         $( "#json" ).append( "<details id=\"" + detailID + "\">Element " + (i + 1) + ": </details>" );

//         var summaryID = detailID + "_" + (i + 1);
//         $( "#" + detailID  ).append( "<summary id = \"" + summaryID + "\"> Element " + (i + 1) + " </summary>" );

//         var formID = summaryID + "_" + (i + 1);
//         $( "#" + detailID  ).append( "<form id = \"" + formID + "\"></summary>" );

//         var jVal = "jVal";
//         var counter = 1;
//         // add json content
//         for (var num in b.Elements[i]) {

//             if (num === "textcontent") {    // see if the json file template is type 1 or 2
                
//                 // append "textcontent: {" if type 2
//                 $( "#" + formID ).append("textcontent: {<br>");

//                 for (var c in b.Elements[i].textcontent) { 
//                     // create input boxes
//                     $( "#" + formID).append(c + ": <input id=\"" + jVal + "_" + (i+1) + "_" + counter + "\" type=\"text\"><br>");

//                     // display the current json value
//                     document.getElementById(jVal + "_" + (i+1) + "_" + counter).value = b.Elements[i].textcontent[c];

//                     counter = counter + 1;
//                 }
//             }
//             else{
//                 // create input boxes
//                 $( "#" + formID).append(num + ": <input id=\"" + jVal + "_" + (i+1) + "_" + counter + "\" type=\"text\"><br>");

//                 // display the current json value
//                 document.getElementById(jVal + "_" + (i+1) + "_" + counter).value = b.Elements[i][num];

//                 counter = counter + 1;
//             }
            
//         }
//         response = "load proceeded";
//     }

//     event.returnBalue = response;
// });

ipcMain.on(constants.API_CALLS.READ_FILE, (event, arg) => {
    let data = fs.readFileSync(fileName, 'utf8');
    event.returnValue = data;
});

function airlineExists(airline, currentAirlines){
    // will check to see if the airline exists, this is case sensitve
    for(var i in currentAirlines){
        if(currentAirlines[i] === airline){
            return true;
        }
    }
    return false;
}

ipcMain.on(constants.API_CALLS.DELETE_BACKUPS, (event, airlinePath)=>{
    let response = "Delete backup with error";
    if(fs.existsSync(airlinePath)){ //path exists see if files exists
        if((fs.existsSync(airlinePath + "\\2.original.json")) && (fs.existsSync(airlinePath + "\\3.original.json"))){
            //both backups exist
            //delete them
            rimraf.sync(airlinePath + "\\2.original.json");
            rimraf.sync(airlinePath + "\\3.original.json");
            response = "backup is done";
        }
    }
    event.returnValue = response;
});