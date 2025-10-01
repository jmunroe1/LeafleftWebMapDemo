// earthquake map initialization
var quakeMap = L.map('earthquakemap').setView([20, 0], 2);

var mapTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
quakeMap.addLayer(mapTiles);

function pickColor(magnitude) {
    if (magnitude >= 7.0) return '#8b0000';
    else if (magnitude >= 6.0) return '#ff0000';
    else if (magnitude >= 5.0) return '#ff6600';
    else if (magnitude >= 4.0) return '#ffa500';
    else if (magnitude >= 3.0) return '#ffff00';
    else return '#00ff00';
}

function pickSize(magnitude) {
    if (magnitude >= 7.0) return 20;
    else if (magnitude >= 6.0) return 16;
    else if (magnitude >= 5.0) return 12;
    else if (magnitude >= 4.0) return 10;
    else if (magnitude >= 3.0) return 8;
    else return 6;
}

function formatTime(timestamp) {
    var date = new Date(timestamp);
    return date.toLocaleString();
}

function makeMarkerStyle(magnitude) {
    return {
        radius: pickSize(magnitude),
        fillColor: pickColor(magnitude),
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

var earthquakeAPI = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

$.getJSON(earthquakeAPI, function(earthquakeData) {
    console.log('Earthquake data loaded:', earthquakeData.features.length, 'earthquakes');
    
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            var magnitude = feature.properties.mag;
            return L.circleMarker(latlng, makeMarkerStyle(magnitude));
        },
        
        onEachFeature: function(feature, layer) {
            var info = feature.properties;
            var coords = feature.geometry.coordinates;
            
            var popupText = 
                '<div class="earthquake-popup">' +
                '<h3>Earthquake Details</h3>' +
                '<p><strong>Magnitude:</strong> ' + (info.mag || 'N/A') + '</p>' +
                '<p><strong>Location:</strong> ' + (info.place || 'Unknown location') + '</p>' +
                '<p><strong>Time:</strong> ' + formatTime(info.time) + '</p>' +
                '<p><strong>Depth:</strong> ' + (coords[2] ? coords[2].toFixed(1) + ' km' : 'N/A') + '</p>' +
                '<p><strong>Coordinates:</strong> ' + coords[1].toFixed(3) + ', ' + coords[0].toFixed(3) + '</p>';
            
            if(info.url) {
                popupText += '<p><a href="' + info.url + '" target="_blank">More details</a></p>';
            }
            
            popupText += '</div>';
            
            layer.bindPopup(popupText);
        }
    }).addTo(quakeMap);
    
    var count = earthquakeData.features.length;
    document.querySelector('#header p').textContent = 
        'Displaying ' + count + ' earthquakes from the past 24 hours worldwide';
})
.fail(function(jqxhr, textStatus, error) {
    console.error('Error loading earthquake data:', textStatus, error);
    alert('Failed to load earthquake data. Please check your internet connection.');
});

quakeMap.attributionControl.addAttribution('Earthquake data from <a href="https://earthquake.usgs.gov/">USGS</a>');