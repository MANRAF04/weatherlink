let API_KEY = 'API_KEY';
let API_SECRET = 'API_SECRET';
let STATION_ID = '147952'
let t = Math.floor(Date.now() / 1000);

let firstDateString = '2023-02-11T14:45:00';
let secondDateString = '2023-02-11T16:00:00';
let firstDate = new Date(firstDateString);
let secondDate = new Date(secondDateString);

const unixTimeFirst = firstDate.getTime();
const unixTimeSecond = secondDate.getTime();

const unixTimeInSecondsFirst = unixTimeFirst / 1000;
const unixTimeInSecondsSecond = unixTimeSecond / 1000;


let apiHashHis = `api-key${API_KEY}end-timestamp${unixTimeInSecondsSecond}start-timestamp${unixTimeInSecondsFirst}station-id${STATION_ID}t${t}`;
let apiHashCur = `api-key${API_KEY}station-id${STATION_ID}t${t}`;

var apiSignatureCur = CryptoJS.HmacSHA256(apiHashCur, API_SECRET).toString();
var apiSignatureHis = CryptoJS.HmacSHA256(apiHashHis, API_SECRET).toString();

let FULL_URL_HIS = (`https://api.weatherlink.com/v2/historic/${STATION_ID}?api-key=${API_KEY}&t=${t}&start-timestamp=${unixTimeInSecondsFirst}&end-timestamp=${unixTimeInSecondsSecond}&api-signature=${apiSignatureHis}`);
let FULL_URL_CUR = (`https://api.weatherlink.com/v2/current/${STATION_ID}?api-key=${API_KEY}&t=${t}&api-signature=${apiSignatureCur}`);

fetch(FULL_URL_CUR).then(rep => rep.json()).then(
    data => {
        data = data.sensors[1].data[0];
        let humidity = data.hum;
        let aqi = data.aqi_val.toFixed(2);
        let heatIndex = toCelcius(data.heat_index);
        let temp = toCelcius(data.temp);
        let dewPoint = toCelcius(data.dew_point);
        let pm1 = data.pm_1.toFixed(2);
        let pm2p5 = data.pm_2p5.toFixed(2);
        let pm10 = data.pm_10.toFixed(2);
        let wetBulb = data.wet_bulb.toFixed(2);

        let table = `<table><caption>Current Weather Data from ${STATION_ID}</caption><tr><th>AQI</th><th>PM1</th><th>PM2.5</th><th>PM10</th><th>Temperature</th><th>Humidity</th><th>Heat Index</th><th>Dew Point</th><th>Wet Bulb</th></tr>`;
        table += `<tr><td>${aqi}</td><td>${pm1}</td><td>${pm2p5}</td><td>${pm10}</td><td>${temp}</td><td>${humidity}</td><td>${heatIndex}</td><td>${dewPoint}</td><td>${wetBulb}</td></tr></table>`;

        document.getElementById('tableContainerCur').innerHTML = table;
    });

fetch(FULL_URL_HIS).then(rep => rep.json()).then(
    data => {
        data = data.sensors[1].data;
        firstDate = new Date(firstDate.getTime()+15*60*1000)
        let table = `<table><caption>Weather Data from ${STATION_ID} from ${firstDate.toLocaleDateString()} ${firstDate.toLocaleTimeString()} to ${secondDate.toLocaleDateString()} ${secondDate.toLocaleTimeString()}</caption><tr><th>AQI</th><th>PM1</th><th>PM2.5</th><th>PM10</th><th>Temperature</th><th>Humidity</th><th>Heat Index</th><th>Dew Point</th><th>Wet Bulb</th></tr>`;

        data.forEach(function (measurement){
            table += `<tr><td>${measurement.aqi_avg_val.toFixed(2)}</td><td>${measurement.pm_1_avg.toFixed(2)}</td><td>${measurement.pm_2p5_avg.toFixed(2)}</td><td>${measurement.pm_10_avg.toFixed(2)}</td><td>${toCelcius(measurement.temp_avg)}</td><td>${measurement.hum_last}</td><td>${toCelcius(measurement.heat_index_last)}</td><td>${toCelcius(measurement.dew_point_last)}</td><td>${toCelcius(measurement.wet_bulb_last)}</td></tr>`;
        });

        table += '</table>';

        document.getElementById('tableContainerHis').innerHTML = table;
    });

function toCelcius(num) {
    return ((num - 32) / 1.8).toFixed(2);
}