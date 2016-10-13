var http = require('http');
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();


port = 1492;
var sensors = {};
counter = 0;
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);
console.log('listening on port', port)

sensors.name = "SAAS weather station"

function updateSensors() {
    //dateTime barometer pressure altimeter inTemp outTemp inHumidity outHumidity
    //windSpeed windDir windGustDir rainRate rain dewpoint windchill heatindex
    var db = new sqlite3.Database('/var/lib/weewx/weewx.sdb');
    db.serialize(function() {
        db.each("SELECT * FROM archive ORDER BY dateTime DESC LIMIT 1", function(err, row) {
            var d = new Date(row.dateTime * 1000);
            var n = d.toISOString();
            console.log(n + ": " + row.barometer);
            sensors.barometer = row.barometer.toFixed(2);
            sensors.inTemp = row.inTemp.toFixed(2);
            sensors.dateTime = n;
            sensors.a = "a";
            sensors.thelist = [1, 2, 3];
            sensors.thelist.push(8);

        });
    });
    db.close();
}
updateSensors();

app.all('/all', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    sensors.counter = counter;
    counter = counter + 1;
    sensors.temperature = 76 + Math.random() * 5;
    sensors.temperature = sensors.temperature.toFixed(2);
    updateSensors();
    res.send(JSON.stringify(sensors));
});

function updateTemps() {
    //dateTime barometer pressure altimeter inTemp outTemp inHumidity outHumidity
    //windSpeed windDir windGustDir rainRate rain dewpoint windchill heatindex
    var db = new sqlite3.Database('/var/lib/weewx/weewx.sdb');
    sensors.tempList = [];
    db.serialize(function() {
        db.each("SELECT * FROM archive ORDER BY dateTime DESC LIMIT 10", function(err, row) {
            sensors.tempList.push(row.inTemp.toFixed(2));
            console.log(row.inTemp.toFixed(2));
            //row.inTemp.toFixed(2);
        });
    });
    db.close();
    console.log('alpha',sensors);
    return sensors;
}
updateTemps();
app.all('/templist', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('updatesensors',updateTemps());
    //console.log(sensors);
    res.send(JSON.stringify(sensors));
});
