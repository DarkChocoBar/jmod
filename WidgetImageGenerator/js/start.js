var urlParams = parseURLParams(window.location.href);
if (urlParams != undefined && urlParams['airline'] != undefined && urlParams['comp'] != undefined && urlParams['s'] != undefined) {
    window.airline = urlParams['airline'][0];
    window.comp = urlParams['comp'][0];
    window.s = urlParams['s'][0];

    log.info("[" + airline + " - " + comp + " - " + s + "] Image generator refreshed with new params.", {
        "Airline": airline,
        "Comp": comp,
        "Unit": s
    });

} else {
    window.airline = window.htmlItems[0]["Airline"];
    window.comp = window.htmlItems[0]["Comp"];
    window.s = window.htmlItems[0]["Units"][0];
    log.info("[" + airline + " - " + comp + " - " + s + "] Image generator started with initial params.", {
        "Airline": airline,
        "Comp": comp,
        "Unit": s
    });
}

window.paramString = "[" + airline + " - " + comp + " - " + s + "] ";
window.cNarioTime = 0;
window.startTime = 0;
window.lastms = (new Date).getTime();
window.jsStartTime = (new Date).getTime();
window.hasStarted = false;
window.isCNario = false;

// Capture resize event
/* window.addEventListener('resize', function(e) {
    var newLocation = (window.location = window.location.protocol + "//" + window.location.hostname + ":" +
        window.location.port + window.location.pathname).replace("index.html", "");
    newLocation += "resizeerror.html";
    window.location = newLocation;
});
 */
var clockCorrections = [];
var totalCalls = 0;
var totalTime = 0;

var cNarioClockTimeout = setTimeout(function() {
    //document.documentElement.style.background = "#4a6acf";
    startWidget();
}, 1000);

function startWidget() {

    if (airline != undefined && comp != undefined && s != undefined) {
        var widget = new SYNECT.DITWidget('json/' + airline + "/" + comp + "/" + s + '.json', false);
        widget.start();
    } else {
        displayError("Error: URL parameters not set");
    }
}

function displayError(errorText) {
    document.getElementById("debug").innerHTML = errorText;
}