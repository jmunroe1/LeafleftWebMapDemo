# WebGIS Assignment 4 - Leaflet Web Maps
## Author: Jonathan Munroe

This repository contains interactive web maps built with Leaflet.js demonstrating real-time geospatial data visualization.

## 🌟 Combined Weather & Earthquake Map (Bonus)
An advanced interactive map that combines both weather alerts and earthquake data with toggle controls:  
- **Layer Toggle System**: Switch between weather alerts, earthquake data, and precipitation radar  
- **Real-time Weather Alerts**: Color-coded severity levels with detailed popups  
- **Live Earthquake Data**: Magnitude-based markers with comprehensive information  
- **Precipitation Radar**: Real-time weather radar overlay  
- **Dynamic Legends**: Context-sensitive legends that show/hide with layer toggles  
- **Status Indicators**: Real-time loading status for each data layer  

**Combined Map:** <https://jmunroe1.github.io/LeafleftWebMapDemo/combined/>

## Weather Map
A comprehensive weather visualization showing:  
- Real-time precipitation radar from the National Weather Service  
- Active weather alerts with color-coded severity levels  
- Interactive popups with detailed alert information  

**Features:**
- Severe alerts in red
- Extreme alerts in dark red
- Minor alerts in yellow
- Default alerts in orange

**Weather Map:** <https://jmunroe1.github.io/LeafleftWebMapDemo/weather/>

## Earthquake Map
A real-time earthquake monitoring map displaying:  
- Global earthquake data from the past 24 hours (USGS)  
- Magnitude-based marker styling with colors and sizes  
- Detailed popups showing magnitude, location, time, and depth  
- Interactive legend explaining earthquake severity levels  

**Magnitude Scale:**
- 🟢 0.0-2.9: Minor earthquakes
- 🟡 3.0-3.9: Light earthquakes  
- 🟠 4.0-4.9: Moderate earthquakes
- 🔶 5.0-5.9: Strong earthquakes
- 🔴 6.0-6.9: Major earthquakes
- 🔴 7.0+: Great earthquakes

**Earthquake Map:** <https://jmunroe1.github.io/LeafleftWebMapDemo/earthquake/>

## Technologies Used
- **Leaflet.js** - Interactive mapping library
- **jQuery** - Data fetching and DOM manipulation
- **USGS Earthquake API** - Real-time earthquake data
- **National Weather Service API** - Weather alerts and radar data
- **OpenStreetMap** - Base map tiles
- **Layer Groups** - Advanced layer management and toggle controls