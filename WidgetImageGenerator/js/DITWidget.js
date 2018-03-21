var first_time = true;

SYNECT.DITWidget = Class.extend({
    init: function(JSONPath) {
        var sources;
        var elementObjects;
        var hasInitialized = false;
        var loader = new SYNECT.Loader();
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        var pollPeriod = 0; // Number of milliseconds to wait between polling server, or 0 for no polling
        var pollTime = 0;
        var elementStates = [];
        var transitionStates = {
            HIDE_BEFORE: 0,
            TRANSITION_IN: 1,
            STAY_STILL: 2,
            TRANSITION_OUT: 3,
            HIDE_AFTER: 4
        };
        var frameTimes= [];


        /**
         * Updates the content in a content element
         * @param elementIndex The index of the content element on the page
         */
        var initializeElement = function(elementIndex) {

            var setInitialProperties = function(element) {
                element.removeAttribute("style");
                if (elementObjects[elementIndex]["customStyle"] != undefined) {
                    element.setAttribute("style", elementObjects[elementIndex]["customStyle"]);
                }
                element.style.overflow = "visible";
                element.style.position = "absolute";
                element.style.display = "block";
                element.style.zIndex = elementObjects[elementIndex].zIndex;
                element.style.top = elementObjects[elementIndex].y + "px";
                if (elementObjects[elementIndex]["align"] == "right") {
                    element.style.right = elementObjects[elementIndex].x + "px";
                } else {
                    element.style.left = elementObjects[elementIndex].x + "px";
                }
                element.style.display = "none";
            };

            var setTextProperties = function(element, textContent) {
                element.innerHTML = textContent.text;
                element.style.fontFamily = textContent.font;
                element.style.fontSize = textContent.fontSize + "px";
                element.style.fontWeight = textContent.fontWeight;
				
                element.style.fontStyle = textContent.fontStyle;
                element.style.color = textContent.fontColor;
                element.style.padding = "0";
            };

            // TODO: create a setImagePropeties function for setting up image content

            // Create an HTML element for this content object
            var elementObject = elementObjects[elementIndex];
            var tagName = elementObject.type == "image" ? "img" : "div";
            var element = document.createElement(tagName);
            element.id = "element" + elementIndex;
            setInitialProperties(element);
            setTextProperties(element, elementObject["textcontent"]);
            //var dataDiv = document.getElementById('dataDiv');
            //dataDiv.appendChild(element);
            document.body.appendChild(element);
        };

        var updateElement = function(elementIndex) {

            var setTextProperties = function(element, textContent) {
                element.innerHTML = textContent.text;
                element.style.fontFamily = textContent.font;
                element.style.fontSize = textContent.fontSize + "px";
                element.style.fontWeight = textContent.fontWeight;
                element.style.fontStyle = textContent.fontStyle;
                element.style.color = textContent.fontColor;
            };

            // Update text
            var elementObject = elementObjects[elementIndex];
            var element = document.getElementById("element" + elementIndex);
            setTextProperties(element, elementObject["textcontent"]);
        };

        /**
         * Initializes the content that should first display on page at startup
         */
        var initializeContent = function() {

            if (window.isCNario) {
                window.lastms = window.startTime;
            }

            for (var i = 0; i < elementObjects.length; i++) {
                elementStates[i] = {
                    transitionState: transitionStates.HIDE_BEFORE,
                    elapsedTimeThisState: 0
                };
                initializeElement(i);
            }
        };

        var updateContent = function() {
            for (var i = 0; i < elementObjects.length; i++) {
                updateElement(i);
            }
        };

        var signalEnd = function() {
            var url = IMAGE_SERVER_URL + IMAGE_SERVER_TRANSACTION_END_PATH;
            $.getJSON(url)
                .success(function() {
                    console.log("Transaction end signal successfully sent");
                })
                .error(function() {
                    console.log("Transaction end signal failed");
                });
        };

        /**
         * Loads the next html Item (after image processing + upload is complete).
         */
        function loadNextHtmlItem() {

            var airlineObject = getAirlineObject();
            var unitIndex = getUnitIndex(airlineObject);

            // Last unit?
            if (unitIndex >= airlineObject["Units"].length - 1) {

                // Last unit, move to next airline
                var airlineIndex = getAirlineIndex();

                // Last airline?
                if (airlineIndex >= window.htmlItems.length - 1) {
                    // Last airline, move back to first airline and first unit
                    signalEnd();
                    setTimeout(function() {
                        refreshPageWithNewParams(window.htmlItems[0]["Airline"], window.htmlItems[0]["Comp"], window.htmlItems[0]["Units"][0]);
                    }, window.HTML_RESTART_DELAY);
                } else {
                    // Move to next airline, first unit
                    refreshPageWithNewParams(window.htmlItems[airlineIndex + 1]["Airline"],
                        window.htmlItems[airlineIndex + 1]["Comp"], window.htmlItems[airlineIndex + 1]["Units"][0]);
                }

            } else {
                // Move to next unit with same airline
                refreshPageWithNewParams(airline, comp, airlineObject["Units"][unitIndex + 1]);
            }

            function getAirlineObject() {
                for (var i = 0; i < window.htmlItems.length; i++) {
                    if (window.htmlItems[i]["Airline"] == airline) {
                        return window.htmlItems[i];
                    }
                }
                return null;
            }

            function getAirlineIndex() {
                for (var i = 0; i < window.htmlItems.length; i++) {
                    if (window.htmlItems[i]["Airline"] == airline) {
                        return i;
                    }
                }
                return -1;
            }

            function getUnitIndex(airlineObject) {
                for (var i = 0; i < airlineObject["Units"].length; i++) {
                    if (airlineObject["Units"][i] == parseInt(s)) {
                        return i;
                    }
                }
                return -1;
            }

            // Refreshes page using new url parameters
            function refreshPageWithNewParams(airlineParam, compParam, sParam) {

                window.location = window.location.protocol + "//" + window.location.hostname + ":" +
                    window.location.port + window.location.pathname + "?airline=" + airlineParam + "&comp=" +
                    compParam + "&s=" + sParam;

            }
        }

        /**
         * Main animation loop
         */
        var tick = function() {

            if(!first_time){
                return;
            }
            window.requestAnimationFrame(tick);

            var nowms;
            if (window.isCNario) {
                nowms = window.cNarioTime;
            } else {
                nowms = (new Date).getTime();
            }
            var deltaTime = nowms - window.lastms;
            pollTime += deltaTime;
            window.lastms = nowms;

            // Calculate FPS for last second
            var jsTime = (new Date).getTime();
            frameTimes.push(jsTime);
            for (var i = frameTimes.length - 1; i >= 0; i--) {
                if (jsTime - frameTimes[i] >= 1000) {
                    // get rid of frames that happened more than 1 second ago
                    frameTimes.splice(i, 1);
                }
            }
            //document.getElementById("fps").innerHTML = "" + frameTimes.length;

            for (i = 0; i < elementObjects.length; i++) {

                var elementState = elementStates[i];
                var element = document.getElementById("element" + i);

                // determine how much time is needed for current state based on current state
                var stateTime = 0;
                switch(elementState.transitionState) {
                    case transitionStates.HIDE_BEFORE:
                        stateTime = elementObjects[i]["startDelay"];
                        break;
                    case transitionStates.TRANSITION_IN:
                        stateTime = elementObjects[i]["transitionInTime"];
                        break;
                    case transitionStates.STAY_STILL:
                        stateTime = elementObjects[i]["displayTime"];
                        if(first_time) {
                            first_time = false;
                        }
                        break;
                    case transitionStates.TRANSITION_OUT:
                        stateTime = elementObjects[i]["transitionOutTime"];
                        break;
                    case transitionStates.HIDE_AFTER:
                        continue;
                }

                // increment transition state if enough time has elapsed
                elementState.elapsedTimeThisState += deltaTime;
                if (elementState.elapsedTimeThisState > stateTime) {

                    // reset elapsedTimeThisState
                    elementState.elapsedTimeThisState = 0;

                    // move to next state
                    elementState.transitionState = Math.min((elementState.transitionState + 1), 4);
                }

                // update transition animation based on transition state and elapsed time in current state
                var percentCompleted = elementState.elapsedTimeThisState / stateTime;
                switch(elementState.transitionState) {

                    case transitionStates.TRANSITION_IN:
                        updateTransition(element, elementObjects[i], percentCompleted, "in");
                        element.style.display = "block";
                        break;

                    case transitionStates.STAY_STILL:
                        element.style.top = elementObjects[i].y + "px";
                        element.style.opacity = "1";
                        break;

                    case transitionStates.TRANSITION_OUT:
                        updateTransition(element, elementObjects[i], percentCompleted, "out");
                        break;

                    case transitionStates.HIDE_AFTER:
                        element.style.display = "none";
                }
            }

            function updateTransition(element, elementObject, percentCompleted, direction) {

                var smoothedPercent = Math.max(0, Math.min(1, 0.48 +
                    (0.58*(Math.atan(14*percentCompleted - 4)/(Math.PI/2))))); // just trust this

                if (direction == "in") {
                    switch(elementObject["transitionInType"]) {
                        case "slideleft":
                            if (elementObject["align"] == "right") {
                                element.style.right = (elementObjects[i].x - (screenWidth*(1-smoothedPercent))) + "px";
                            } else {
                                element.style.left = (elementObjects[i].x + (screenWidth*(1-smoothedPercent))) + "px";
                            }
                            element.style.opacity = smoothedPercent;
                            break;
                        case "slideright":
                            if (elementObject["align"] == "right") {
                                element.style.right = (elementObjects[i].x + (screenWidth*(1-smoothedPercent))) + "px";
                            } else {
                                element.style.left = (elementObjects[i].x - (screenWidth*(1-smoothedPercent))) + "px";
                            }
                            element.style.opacity = smoothedPercent;
                            break;
                        case "fade":
                            element.style.opacity = percentCompleted;
                            break;
                        case "fade2":
                            element.style.opacity = smoothedPercent;
                            break;
                    }
                } else {
                    switch(elementObject["transitionOutType"]) {
                        case "slideleft":
                            if (elementObject["align"] == "right") {
                                element.style.right = (elementObjects[i].x + (screenWidth*smoothedPercent)) + "px";
                            } else {
                                element.style.left = (elementObjects[i].x - (screenWidth*smoothedPercent)) + "px";
                            }
                            element.style.opacity = 1 - smoothedPercent;
                            break;
                        case "slideright":
                            if (elementObject["align"] == "right") {
                                element.style.right = (elementObjects[i].x - (screenWidth*smoothedPercent)) + "px";
                            } else {
                                element.style.left = (elementObjects[i].x + (screenWidth*smoothedPercent)) + "px";
                            }
                            element.style.opacity = 1 - smoothedPercent;
                            break;
                        case "fade":
                            element.style.opacity = 1 - percentCompleted;
                            break;
                        case "fade2":
                            element.style.opacity = 1 - smoothedPercent;
                            break;
                    }
                }
            }

            // Poll server again if needed
            if (pollPeriod > 0 && pollTime > pollPeriod) {
                pollTime = 0;
                start();
            }

        };

        /**
         * Starts this widget.
         */
        function start() {

            loader.loadJSON(JSONPath,
                function(response) {

                    // This widget's JSON file was loaded successfully
                    log.info(paramString + "JSON File loaded successfully.", {
                        "Airline": airline,
                        "Comp": comp,
                        "Unit": s,
                        "JSONPath": JSONPath
                    });
                    sources = response["Sources"];
                    elementObjects = response["Elements"];
                    var reloadSingleFlightVersion = false;

                    // Load all source urls in parallel
                    var sourcesToLoad = [];
                    for (var i = 0; i < sources.length; i++) {
                        (function(_i) {
                            sourcesToLoad.push({
                                url: sources[_i].url,
                                success: function(response) {
                                    // If only 1 flight, reload page with new JSON path
                                    if (response.length <= 1 && JSONPath.indexOf('SingleFlight') == -1) {
                                        reloadSingleFlightVersion = false; //TODO: Change this to true when we support alt JSON for single flight
                                    }
                                    sources[_i]["result"] = response;
                                },
                                error: function() {
                                    sources[_i]["result"] = null;
                                }
                            });
                        })(i);
                    }
                    loader.multiLoad(sourcesToLoad, function() {
                        // All source urls successfully loaded
                        // Add source results to relevant elements

                        if (reloadSingleFlightVersion) {
                            JSONPath = JSONPath.replace('.json', '') + '_SingleFlight.json';
                            start();
                            return;
                        } else {
                            formatData(function() {
                                if (!hasInitialized) {
                                    initializeContent();
                                    tick();
                                    hasInitialized = true;
                                    console.log("Successful initialization.");
                                } else {
                                    updateContent();
                                    console.log("Successful poll.");
                                }

                            });
                        }

                    }, function() {
                        if (window.AutoLoadNextHtmlItem) {
                        loadNextHtmlItem();
                        }
                    });
                },
                function(xhr) {
                    log.error(paramString + "Error loading JSON file. Moving on to next image.", {
                        "Airline": airline,
                        "Comp": comp,
                        "Unit": s,
                        "JSONPath": JSONPath,
                        "Status": xhr.status
                    });
                    if (window.AutoLoadNextHtmlItem) {
                    loadNextHtmlItem();
                    }
                }
            );
        }

        function formatData(doneCallback) {
            for (var i = 0; i < elementObjects.length; i++) {
                var sourceId = elementObjects[i]["textcontent"]["sourceId"];
                var formattingFunction = elementObjects[i]["textcontent"]["formattingFunction"];
                if (sourceId != undefined && formattingFunction != undefined) {
                    var source = getSourceById(sourceId);
                    elementObjects[i]["textcontent"]["text"] = eval(formattingFunction)(source["result"], elementObjects[i]["textcontent"]["index"]);
                }
            }
            doneCallback();
        }

        function getSourceById(sourceId) {
            for (var i = 0; i < sources.length; i++) {
                if (sources[i].id == sourceId) {
                    return sources[i];
                }
            }
            return null;
        }

        function formatTime(ms) {
            var date = new Date(ms);
            var timezoneOffsetInHours = date.getTimezoneOffset() / 60;
            var correctedMs = ms + timezoneOffsetInHours*(3.6e+6);
            var correctedDate = new Date(correctedMs);

            var hours = correctedDate.getHours();

            if (hours > 12) {
                hours -= 12;
            } else if (hours == 0) {
                hours = 12;
            }
            if (hours < 10) {
                hours = "<span style='visibility:hidden'>0</span>" + hours;
            }
            var minutes = correctedDate.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes + parseAMorPM(ms);
        }

        function parseDate(ms) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var date = new Date(ms);
            var timezoneOffsetInHours = date.getTimezoneOffset() / 60;
            var correctedMs = ms + timezoneOffsetInHours*(3.6e+6);
            var correctedDate = new Date(correctedMs);
            var month = monthNames[correctedDate.getMonth()];
            var day = correctedDate.getDate();
            return month + " " + day;
        }

        function parseAMorPM(ms) {
            var date = new Date(ms);
            var timezoneOffsetInHours = date.getTimezoneOffset() / 60;
            var correctedMs = ms + timezoneOffsetInHours*(3.6e+6);
            var correctedDate = new Date(correctedMs);
            var hours = correctedDate.getHours();
            if (hours > 11) {
                return " PM";
            } else {
                return " AM";
            }
        }

        function shortFlightNumber(data, index) {
            if (data[index] != undefined) {
                if (data[index]["FlightNumber"] != undefined) {
                    var statusElement = window.WAITING_AREA_STATUS_STYLE == "circle" ? smallStatusCircle(data, index) : addStatusText(data, index, "smallstatustext");
                    return data[index]["FlightNumber"][0] + " " + statusElement;
                } else {
                    return "";
                }
            } else {
                return "";
            }

        }

        function shortenedTime(data, index) {
            if (data[index] != undefined) {
                var ms = data[index]["ActualTimeMillis"];
                return formatTime(ms);
            } else {
                return "&nbsp; ";
            }

        }

        function flightNumberOnly(data, index) {
            if (data[index] != undefined && data[index]["FlightNumber"] != undefined && data[index]["FlightNumber"][0] != undefined) {
                return data[index]["FlightNumber"][0];
            } else {
                return "";
            }
        }

        function flightAndStatus(data, index) {
            if (data[index] != undefined) {
                var statusElement = window.CHECKIN_STATUS_STYLE == "circle" ? addStatusCircle(data, index) : addStatusText(data, index, "statustext");
                return "FLIGHT " + data[index]["FlightNumber"][0] + " " + statusElement;
            } else {
                return "";
            }
        }

        function flightAndSmallStatus(data, index) {
            if (data[index] != undefined) {
                var statusElement = window.CHECKIN_STATUS_STYLE == "circle" ? mediumStatusCircle(data, index) : addStatusText(data, index, "statustext");
                return "FLIGHT " + data[index]["FlightNumber"][0] + " " + statusElement;
            } else {
                return "";
            }
        }

        function flightNumber(data, index) {
            if (data[index] != undefined) {
                return "FLIGHT " + data[index]["FlightNumber"][0];
            } else {
                return "";
            }
        }

        function departureTime(data, index) {
            if (data[index] != undefined) {
                var ms = data[index]["ActualTimeMillis"];
                return formatTime(ms) + " - " + parseDate(ms, false);
            } else {
                return "";
            }
        }

        function destination(data, index) {
            if (data != undefined && data[index] != undefined) {				
                return data[index]["CityDestenation"][0].toUpperCase();
            } else {
                return "";
            }
        }

        function lcDestination(data, index) {
            if (data != undefined && data[index] != undefined) {
                return data[index]["CityDestenation"][0];
            } else {
                return "";
            }
        }

        function parseAirline(data, index) {
            if (data[index] != undefined) {
                return data[index]["AirlineName"][0];
            } else {
                return "";
            }
        }

        function hasGate(data, index) {
            if (data[index] != undefined) {
                return (data[index]["Gate"] != undefined && data[index]["Gate"] != null)
            } else {
                return false;
            }

        }

        function parseGate(data, index) {
            if (hasGate(data, index)) {
                return data[index]["Gate"];
            } else {
                return "";
            }
        }

        function displayGateLabel(data, index) {
            if (hasGate(data, index)) {
                return "GATE";
            } else {
                return "";
            }
        }

        function basicStatus(data, index) {
            if (data[index] != undefined) {
                if (data[index]["Status"] != undefined) {
                    return data[index]["Status"];
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        function parseStatus(data, index) {
            if (data[index] != undefined) {
                if (data[index]["Status"] != undefined) {
                    var status = data[index]["Status"];
                    var statusHTMLstring;
                    switch(status) {
                        case "On Time":
                            statusHTMLstring = "<div class='ontime'>On Time</div>";
                            break;
                        case "Delayed":
                            statusHTMLstring = "<div class='delayed'>Delayed</div>";
                            break;
                        case "Cancelled":
                            statusHTMLstring = "<div class='cancelled'>Cancelled</div>";
                            break;
                        default:
                            return "";
                    }
                    return statusHTMLstring;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        function addStatusText(data, index, style) {
            if (data[index] != undefined) {
                if (data[index]["Status"] != undefined) {
                    var status = data[index]["Status"];

                    var statusHTMLstring;
                    switch(status) {
                        case "On Time":
                            statusHTMLstring = " - <div class='" + style + " ontime'>On Time</div>";
                            break;
                        case "Delayed":
                            statusHTMLstring = " - <div class='" + style + "  delayed'>Delayed</div>";
                            break;
                        case "Cancelled":
                            statusHTMLstring = " - <div class='" + style + "  cancelled'>Cancelled</div>";
                            break;
                        default:
                            return "";
                    }
                    return statusHTMLstring;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        function addStatusCircle(data, index) {
            if (data[index] != undefined) {
                if (data[index]["Status"] != undefined) {
                    var status = data[index]["Status"];
                    var statusHTMLstring;
                    switch(status) {
                        case "On Time":
                            statusHTMLstring = "<div class='statuscircle ontimebg'><div class='circletext'>On Time</div></div>";
                            break;
                        case "Delayed":
                            statusHTMLstring = "<div class='statuscircle delayedbg'><div class='circletext'>Delayed</div></div>";
                            break;
                        case "Cancelled":
                            statusHTMLstring = "<div class='statuscircle cancelledbg'><div class='circletext'>Cancelled</div></div>";
                            break;
                        default:
                            return "";
                    }
                    return statusHTMLstring;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        function mediumStatusCircle(data, index) {
            if (data[index] != undefined) {
                if (data[index]["Status"] != undefined) {
                    var status = data[index]["Status"];
                    var statusHTMLstring;
                    switch(status) {
                        case "On Time":
                            statusHTMLstring = "<div class='mediumstatuscircle ontimebg'></div>";
                            break;
                        case "Delayed":
                            statusHTMLstring = "<div class='mediumstatuscircle delayedbg'></div>";
                            break;
                        case "Cancelled":
                            statusHTMLstring = "<div class='mediumstatuscircle cancelledbg'></div>";
                            break;
                        default:
                            return "";
                    }
                    return statusHTMLstring;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        function smallStatusCircle(data, index) {
            if (data[index] != undefined) {
                if (data[index]["Status"] != undefined) {
                    var status = data[index]["Status"];
                    var statusHTMLstring;
                    switch(status) {
                        case "On Time":
                            statusHTMLstring = "<div class='smallstatuscircle ontimebg'></div>";
                            break;
                        case "Delayed":
                            statusHTMLstring = "<div class='smallstatuscircle delayedbg'></div>";
                            break;
                        case "Cancelled":
                            statusHTMLstring = "<div class='smallstatuscircle cancelledbg'></div>";
                            break;
                        default:
                            return "";
                    }
                    return statusHTMLstring;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        this.start = function() {
            start();
        }
    }

});