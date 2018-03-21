var SDS_IP = "localhost:8080";

window.AutoLoadNextHtmlItem = false;

window.seqUrl = "http://localhost:5341/api/events/raw";
window.apiKey = "VDfVjSS1WinDvxgx2qm";

window.SDS_API_KEY = ""; // Not currently used
window.SDS_TIMEOUT = 3000; // If the SDS doesn't respond within this amount of time, consider it a failed reqeust
window.SDS_INTERVAL_TIME = 100; // Amount of time to wait before trying the next SDS if the pervious one failed
window.CHECKIN_STATUS_STYLE = "text"; // Options are "circle" and "text" - this is only for NFRA checkin video wall
window.WAITING_AREA_STATUS_STYLE = "circle"; // Options are "circle" and "text" - this is only for NFRA waiting area screen

window.SDS_IP_ADDRESSES = [
    SDS_IP
];

window.IMAGE_SERVER_URL = "http://" + SDS_IP;
window.IMAGE_SERVER_UPLOAD_PATH = "/ImageBank/UploadBinaryImage";
window.IMAGE_SERVER_TRANSACTION_START_PATH = "/ImageBank/TransactionStart";
window.IMAGE_SERVER_TRANSACTION_END_PATH = "/ImageBank/TransactionEnd";

window.IMAGE_HEARTBEAT_SERVER_URL = "http://localhost:9000";
window.IMAGE_SERVER_HEARTBEAT_PATH = "/api/values/signal";

window.htmlItems = [
    {
        "Airline": "SunCountry",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "UnitedAirlines",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "ThomasCook",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "Latam",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "Volaris",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "Spirit",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "Silver",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "AirBerlin",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "IcelandAir",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "Caribbean",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "lufthansa",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "JetBlue",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "AeroMexico",
        "Comp": "Checkin",
        "Units": [2,3]
    },

    	{
        "Airline": "EuroWings",
        "Comp": "Checkin",
        "Units": [2,3]
    },
    {
        "Airline": "Bahamas",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "Avianca",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "Copa",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "SunWing",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "AirTransat",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "VirginAmerica",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "VirginAtlantic",
        "Comp": "Checkin",
        "Units": [2,3]
    },
    {
        "Airline": "WestJet",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "AirCanada",
        "Comp": "Checkin",
        "Units": [2,3]
    },
	{
        "Airline": "BritishAirways",
        "Comp": "Checkin",
        "Units": [2,3]
    }
];

window.HTML_RESTART_DELAY = 30000; // milliseconds to wait after an image is uploaded before loading next HTMl item