let http = require('http');
let express = require('express');
let path = require('path');
let app = express();

app.use(express.static('WidgetImageGenerator'));

app.get('/api/GoaaFid/GetXNextFlightsOfAirlineXWithCutoff/*/*/*/*', function(req, res) {
    let data = [{"Id":"206","FlightDirection":"Departing","ScheduledDateTime":"2018-03-02T18:04:00-05:00","ScheduledTimeMillis":63655610640000,"ActualDateTime":"2018-03-02T18:04:00-05:00","ActualTimeMillis":63655610640000,"ChangeDateTime":"2017-06-15T08:57:32.02-04:00","AirlineCode":["SCX"],"FlightNumber":["652"],"AirlineName":["Sun Country"],"Gate":"1051","Claim":"","CityDestenation":["Seattle"],"CityCode":["LGA"],"Status":"Departed","NumberOfPassengers":0,"Cleared":"","CityOrigin":[""],"CodeSharingDisplayNonPrimaryLogo":false},{"Id":"666","FlightDirection":"Departing","ScheduledDateTime":"2018-03-02T18:04:00-05:00","ScheduledTimeMillis":63655610640000,"ActualDateTime":"2018-03-02T18:04:00-05:00","ActualTimeMillis":63655610640000,"ChangeDateTime":"2017-06-15T08:57:32.02-04:00","AirlineCode":["SCX"],"FlightNumber":["418"],"AirlineName":["Sun Country"],"Gate":"1055","Claim":"0","CityDestenation":["New York"],"CityCode":["LGA"],"Status":"On Time","NumberOfPassengers":0,"Cleared":"","CityOrigin":[""],"CodeSharingDisplayNonPrimaryLogo":false},{"Id":"207","FlightDirection":"Departing","ScheduledDateTime":"2018-03-02T19:04:00-05:00","ScheduledTimeMillis":63655614240000,"ActualDateTime":"2018-03-02T19:04:00-05:00","ActualTimeMillis":63655614240000,"ChangeDateTime":"2017-06-15T08:57:32.02-04:00","AirlineCode":["SCX"],"FlightNumber":["752"],"AirlineName":["Sun Country"],"Gate":"1051","Claim":"","CityDestenation":["Chicago"],"CityCode":["LGA"],"Status":"Departed","NumberOfPassengers":0,"Cleared":"","CityOrigin":[""],"CodeSharingDisplayNonPrimaryLogo":false},{"Id":"667","FlightDirection":"Departing","ScheduledDateTime":"2018-03-02T19:04:00-05:00","ScheduledTimeMillis":63655614240000,"ActualDateTime":"2018-03-02T19:04:00-05:00","ActualTimeMillis":63655614240000,"ChangeDateTime":"2017-06-15T08:57:32.02-04:00","AirlineCode":["SCX"],"FlightNumber":["485"],"AirlineName":["Sun Country"],"Gate":"1055","Claim":"0","CityDestenation":["Boston"],"CityCode":["LGA"],"Status":"On Time","NumberOfPassengers":0,"Cleared":"","CityOrigin":[""],"CodeSharingDisplayNonPrimaryLogo":false}];
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
});

app.listen(8080);




