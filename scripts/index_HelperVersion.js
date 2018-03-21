var {ipcRenderer, remote} = require('electron');
const main = remote.require('./main.js');
const $ = require('jquery');
const constants = require('../constants');

function handleResponse(val) {
    $("#response").html("server responded with: " + val);
}
ipcRenderer.on('async-reply', (event, arg) => {
    handleResponse(arg);
});

console.log("loaded");
$(document).ready(() => {
    $("#btn-sync").click(() => {
        let val = $("#text-input").val();
        let res = ipcRenderer.sendSync(constants.API_CALLS.SYNC, val);
        handleResponse(res);
    });

    $("#btn-async").click(() => {
        let val = $("#text-input").val();
        ipcRenderer.send(constants.API_CALLS.ASYNC, val);
    });

    $("#btn-save-file").click(() => {
        console.log("saving to file");
        let val = $("#text-input").val();
        let res = ipcRenderer.sendSync(constants.API_CALLS.SAVE_FILE, val);
        handleResponse(res);
    });

    $("#btn-read-file").click(() => {
        let res = ipcRenderer.sendSync(constants.API_CALLS.READ_FILE);
        handleResponse(res);
    });
});
