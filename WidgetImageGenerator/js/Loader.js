SYNECT.Loader = Class.extend({
    init: function() {


        this.multiLoad = function (paths, finalCallback, finalError) {

            var totalLoaded = 0;
            if (paths.length == 0) {
                finish();
            }

            for (var i = 0; i < paths.length; i++) {

                (function (_thisPath) {
                    loadFlightData(_thisPath.url, function (data) {
                        _thisPath.success(data);
                        totalLoaded++;
                        finish();
                    }, function() {
                        finalError();
                    });
                })(paths[i]);
            }

            function finish() {
                if (totalLoaded >= paths.length) {
                    finalCallback.call();
                }
            }
        };

        this.loadJSON = function(path, successCallback, errorCallback) {
            loadJSON(path, successCallback, errorCallback);
        };

        function loadJSON(path, successCallback, errorCallback) {
            $.ajax({
                url: path,
                cache: false,
                method: 'GET',
                tryCount: 0,
                retryLimit: 3,
                success: function (data) {
                    successCallback(data);
                },
                error: function (xhr) {
                    this.tryCount++;
                    if (this.tryCount < this.retryLimit) {

                        $.ajax(this);

                    } else {
                        errorCallback(xhr);
                    }
                }
            });
        }

        function loadFlightData(path, successCallback, errorCallback) {
            $.ajax({
                ipIndex: 0,
                url: "http://" + window.SDS_IP_ADDRESSES[0] + path,
                cache: false,
                method: 'GET',
                tryCount: 0,
                retryLimit: 3,
                helloWorld: 0,
                success: function (data) {
                    console.log(this.url + " successfully retrieved.");
                    successCallback(data);
                },
                error: function (xhr) {
                    this.ipIndex++;
                    this.url = "http://" + window.SDS_IP_ADDRESSES[this.ipIndex] + path;
                    if (this.ipIndex < window.SDS_IP_ADDRESSES.length) {

                        log.warning(paramString + "Error querying SDS at " + this.url + ". Trying a fallback IP address.", {
                            "Airline": airline,
                            "Comp": comp,
                            "Unit": s,
                            "SDS Url": this.url,
                            "Status": xhr.status
                        });

                        (function(_this) {
                            setTimeout(function() {
                                $.ajax(_this);
                            }, window.SDS_INTERVAL_TIME);
                        })(this);

                    } else {

                        this.tryCount++;
                        this.ipIndex = 0;
                        this.url = "http://" + window.SDS_IP_ADDRESSES[0] + path;
                        if (this.tryCount <= this.retryLimit) {

                            log.warning(paramString + "Error querying SDS at " + this.url + ". Retrying main SDS IP.", {
                                "Airline": airline,
                                "Comp": comp,
                                "Unit": s,
                                "SDS Url": this.url,
                                "Status": xhr.status
                            });

                            $.ajax(this);
                        } else {
                            log.error(paramString + "All attempts to contact SDS have failed. Moving on to next image.", {
                                "Airline": airline,
                                "Comp": comp,
                                "Unit": s,
                                "SDS Url": this.url,
                                "Status": xhr.status
                            });
                            errorCallback();
                        }
                    }
                },
                timeout: window.SDS_TIMEOUT
            });
        }

        function loadLocalFakeFlightData(path, successCallback, errorCallback) {
            $.ajax({
                url: path,
                cache: false,
                method: 'GET',
                success: function (data) {
                    successCallback(data);
                },
                error: function (xhr) {
                    errorCallback(xhr);
                }
            });
        }

        this.postImageData = function(postData, successCallback, errorCallback) {
            var path = window.IMAGE_SERVER_URL + window.IMAGE_SERVER_UPLOAD_PATH;
            log.info(paramString + "Attempting to upload image.", {
                "Airline": airline,
                "Comp": comp,
                "Unit": s,
                "Url": path
            });

            $.ajax({
                url: path,
                method: 'POST',
                data: postData,
                dataType: 'json',
                crossOrigin: true,
                success: function(response) {
                    log.info(paramString + "Successfully uploaded image.", {
                        "Airline": airline,
                        "Comp": comp,
                        "Unit": s,
                        "Url": path
                    });
                    successCallback();
                },
                error: function(xhr) {
                    log.info(paramString + "Error uploading image. Moving on to next image.", {
                        "Airline": airline,
                        "Comp": comp,
                        "Unit": s,
                        "Url": path,
                        "Status": xhr.status
                    });
                    errorCallback();
                }
            });
        };

        this.sendHeartbeatToImageServer = function() {
            var path = window.IMAGE_HEARTBEAT_SERVER_URL + window.IMAGE_SERVER_HEARTBEAT_PATH;
            $.ajax({
                url: path,
                crossOrigin: true,
                success: function(response) {
                    console.log("Heartbeat sent.");
                },
                error: function(xhr) {
                    console.log("Error sending heartbeat. Server did not respond.");
                }
            });
        };
    }
});