var myMap = L.map('combinedmap').setView([38, -95], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
myMap.addLayer(tiles);

var weatherStuff = L.layerGroup();
var earthquakeStuff = L.layerGroup();
var radarStuff;

function quakeColor(mag) {
    var colors = {
        7: '#8b0000',
        6: '#ff0000', 
        5: '#ff6600',
        4: '#ffa500',
        3: '#ffff00'
    };
    
    for(var threshold in colors) {
        if(mag >= threshold) {
            return colors[threshold];
        }
    }
    return '#00ff00'; // default green
}

function quakeSize(mag) {
    return Math.max(6, Math.min(20, mag * 3));
}

function weatherAlertColor(severity) {
    switch(severity) {
        case 'Extreme': return '#8b0000';
        case 'Severe': return '#ff0000'; 
        case 'Minor': return '#ffff00';
        default: return '#ffa500';
    }
}

function makeReadableDate(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function makeQuakeMarker(magnitude) {
    var markerOptions = {
        radius: quakeSize(magnitude),
        fillColor: quakeColor(magnitude),
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    return markerOptions;
}

function getWeatherAlerts() {
    var alertsAPI = 'https://api.weather.gov/alerts/active?region_type=land';
    
    $.getJSON(alertsAPI)
        .done(function(alertData) {
            weatherStuff.clearLayers();
            
            var geoLayer = L.geoJSON(alertData, {
                style: function(feature) {
                    var alertColor = weatherAlertColor(feature.properties.severity);
                    return { 
                        color: alertColor,
                        weight: 2,
                        fillOpacity: 0.3,
                        fillColor: alertColor
                    };
                },
                onEachFeature: function(feature, layer) {
                    var info = feature.properties;
                    var popup = '<div class="weather-popup">' +
                        '<h3>Weather Alert</h3>' +
                        '<p><strong>Event:</strong> ' + (info.event || 'N/A') + '</p>' +
                        '<p><strong>Severity:</strong> ' + (info.severity || 'N/A') + '</p>' +
                        '<p><strong>Headline:</strong> ' + (info.headline || 'N/A') + '</p>' +
                        '<p><strong>Area:</strong> ' + (info.areaDesc || 'N/A') + '</p>' +
                        '<p><strong>Effective:</strong> ' + (info.effective ? makeReadableDate(info.effective) : 'N/A') + '</p>' +
                        '<p><strong>Expires:</strong> ' + (info.expires ? makeReadableDate(info.expires) : 'N/A') + '</p>' +
                        '</div>';
                    layer.bindPopup(popup);
                }
            });
            
            geoLayer.addTo(weatherStuff);
            document.getElementById('weather-status').textContent = alertData.features.length + ' weather alerts loaded';
        })
        .fail(function() {
            document.getElementById('weather-status').textContent = 'Failed to load weather alerts';
        });
}

function getEarthquakeData() {
    var usgsURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
    
    $.ajax({
        url: usgsURL,
        method: 'GET',
        success: function(quakeData) {
            earthquakeStuff.clearLayers();
            
            for(var i = 0; i < quakeData.features.length; i++) {
                var quake = quakeData.features[i];
                var coords = quake.geometry.coordinates;
                var lat = coords[1];
                var lng = coords[0];
                var magnitude = quake.properties.mag;
                
                var marker = L.circleMarker([lat, lng], makeQuakeMarker(magnitude));
                
                var popupText = '<div class="earthquake-popup">' +
                    '<h3>Earthquake Details</h3>' +
                    '<p><strong>Magnitude:</strong> ' + (magnitude || 'N/A') + '</p>' +
                    '<p><strong>Location:</strong> ' + (quake.properties.place || 'Unknown') + '</p>' +
                    '<p><strong>Time:</strong> ' + makeReadableDate(quake.properties.time) + '</p>' +
                    '<p><strong>Depth:</strong> ' + (coords[2] ? coords[2].toFixed(1) + ' km' : 'N/A') + '</p>' +
                    '<p><strong>Coordinates:</strong> ' + lat.toFixed(3) + ', ' + lng.toFixed(3) + '</p>';
                
                if(quake.properties.url) {
                    popupText += '<p><a href="' + quake.properties.url + '" target="_blank">More details</a></p>';
                }
                popupText += '</div>';
                
                marker.bindPopup(popupText);
                marker.addTo(earthquakeStuff);
            }
            
            document.getElementById('earthquake-status').textContent = quakeData.features.length + ' earthquakes loaded';
        },
        error: function() {
            document.getElementById('earthquake-status').textContent = 'Failed to load earthquake data';
        }
    });
}

function setupRadar() {
    var radarURL = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
    radarStuff = L.tileLayer.wms(radarURL, {
        layers: 'nexrad-n0r-900913',
        format: 'image/png',
        transparent: true,
        opacity: 0.6
    });
}

function showHideLayer(layer, show) {
    if(show) {
        if(!myMap.hasLayer(layer)) myMap.addLayer(layer);
    } else {
        if(myMap.hasLayer(layer)) myMap.removeLayer(layer);
    }
}

function showHideLegend(legendID, show) {
    document.getElementById(legendID).style.display = show ? 'block' : 'none';
}

var weatherCheckbox = document.getElementById('weather-toggle');
weatherCheckbox.onchange = function() {
    showHideLayer(weatherStuff, this.checked);
    showHideLegend('weather-legend', this.checked);
};

var earthquakeCheckbox = document.getElementById('earthquake-toggle'); 
earthquakeCheckbox.onchange = function() {
    showHideLayer(earthquakeStuff, this.checked);
    showHideLegend('earthquake-legend', this.checked);
};

var radarCheckbox = document.getElementById('radar-toggle');
radarCheckbox.onchange = function() {
    showHideLayer(radarStuff, this.checked);
};

getWeatherAlerts();
getEarthquakeData(); 
setupRadar();

weatherStuff.addTo(myMap);
earthquakeStuff.addTo(myMap);
radarStuff.addTo(myMap);

myMap.attributionControl.addAttribution('Weather data from <a href="https://api.weather.gov/">NWS</a>');
myMap.attributionControl.addAttribution('Earthquake data from <a href="https://earthquake.usgs.gov/">USGS</a>');