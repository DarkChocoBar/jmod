var LEVELS = {
    "None": 0,
    "Fatal": 1,
    "Error": 2,
    "Warning": 3,
    "Information": 4,
    "Debug": 5,
    "Verbose": 6
};

var logLevel = LEVELS["Information"]; //TODO: Figure out why this is somtetimes undefined

// Define log functions
window.log = {

    verbose: function(message, properties) {
        //(4 >= LEVELS["Verbose"]) && httpSink(seqUrl, 'Verbose', message, properties);
    },

    debug: function(message, properties) {
        //(4 >= LEVELS["Debug"]) && httpSink(seqUrl, 'Debug', message, properties);
    },

    info: function(message, properties) {
     //   (4 >= LEVELS["Information"]) && httpSink(seqUrl, 'Information', message, properties);
    },

    warning: function(message, properties) {
       // (4 >= LEVELS["Warning"]) && httpSink(seqUrl, 'Warning', message, properties);
    },

    error: function(message, properties) {
        //(4 >= LEVELS["Error"]) && httpSink(seqUrl, 'Error', message, properties);
    },

    fatal: function(message, properties) {
        //(4 >= LEVELS["Fatal"]) && httpSink(seqUrl, 'Fatal', message, properties);
    }
};

hookErrors();

// Hook into Javascript error events and log them as errors
function hookErrors() {
    window.onerror = function(msg, url, line, col, error) {
        log.error("Javascript error in " + url, {
            "File": url,
            "Line": line,
            "Col": col,
            "Message": msg
        });
    };
}

function unhookErrors() {
    window.onerror = {};
}

// Send data to log server
function httpSink(url, level, message, properties) {

    if (apiKey == undefined) return;

    if (properties == undefined || properties == null) {
        properties = {};
    }

    $.ajax({
        url: url + "?apiKey=" + apiKey,
        tryCount: 0,
        retryLimit: 0,
        method: 'POST',
        contentType: 'text/plain;charset=UTF-8',
        crossOrigin: true,
        data: JSON.stringify({
            "Events": [{
                "Timestamp": (new Date((new Date).getTime() - 1000)).toISOString(),
                "Level": level,
                "MessageTemplate": message,
                "Properties": properties
            }]
        }),
        success: function (data) {
            // Set log level to whatever is set on the server
            var level = data["MinimumLevelAccepted"];
            logLevel = LEVELS[level];

        },
        error: function (xhr) {
            this.tryCount++;
            if (this.tryCount < this.retryLimit) {
                $.ajax(this);
            } else {
                unhookErrors();
                console.error("LOGGING ERROR! Attempt to write a log to the Seq server failed with status code " + xhr.status);
                console.error(xhr);
                hookErrors();
            }
        }
    });
}

function httpSink2(url, level, message, properties) {

    if (apiKey == undefined) return;

    if (properties == undefined || properties == null) {
        properties = {};
    }

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    }

    var xhr = createCORSRequest('POST', url + "?apiKey=" + apiKey);

    var params= JSON.stringify({
        "Events": [
            {
                "Timestamp": (new Date((new Date).getTime() - 1000)).toISOString(),
                "Level": level,
                "MessageTemplate": message,
                "Properties": properties
            }
        ]
    });

    if (xhr != null) {
        xhr.send(params);
    }

}