/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * 
 * @fileoverview This file contains the code for the Google Maps API.
 * 
let map: google.maps.Map;
let streetView: google.maps.StreetViewPanorama;
async function initMap(): Promise<void> {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 40.712775, lng: -74.005973 },
    zoom: 8,
  });
  const centerLatLng = map.getCenter();

  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(40.477399, -74.25909),  // Northeast
      new google.maps.LatLng(40.917577, -73.700272)   // Southwest
    );

    map.fitBounds(bounds);
    map.setOptions({ restriction: { latLngBounds: bounds, strictBounds: true } });
  });

  google.maps.event.addListener(map, 'center_changed', function() {
    // Get the new center of the map
    var newCenter = map.getCenter();
    
    // Get the latitude and longitude of the new center
    var lat = newCenter.lat();
    var lng = newCenter.lng();
    
    // Now you can use lat and lng as needed
    console.log("New center latitude: " + lat);
    console.log("New center longitude: " + lng);
});
}

initMap();
export {};




let map: google.maps.Map;
let streetView: google.maps.StreetViewPanorama;

async function initMap(): Promise<void> {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

  const streetViewDiv = document.createElement("div");
  streetViewDiv.style.height = "100%"; // Make sure it takes up the full height of its container
  document.getElementById("map")?.appendChild(streetViewDiv); // Append it to the map container

  // Initialize the Street View panorama
  streetView = new google.maps.StreetViewPanorama(
    streetViewDiv,
    {
      position: { lat: 47.3758251, lng: 8.5491647 },
      pov: { heading: 50.79523941862321, pitch: 12.946052587435076 } // Adjust as needed
    }
  );

  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(47.320218, 8.448018),  // Northeast
      new google.maps.LatLng(47.434665, 8.625453)   // Southwest
    );

    map.fitBounds(bounds);
    map.setOptions({ restriction: { latLngBounds: bounds, strictBounds: true } });
  });

  google.maps.event.addListener(map, 'center_changed', function() {
    // Get the new center of the map
    var newCenter = map.getCenter();
    
    // Get the latitude and longitude of the new center
    var lat = newCenter.lat();
    var lng = newCenter.lng();
    
    // Now you can use lat and lng as needed
    console.log("New center latitude: " + lat);
    console.log("New center longitude: " + lng);
  });

  // Initialize street view


  streetView = map.getStreetView();

  // Add event listeners to the street view
  google.maps.event.addListener(streetView, 'position_changed', function() {
    // Get the new position of the street view
    var newPosition = streetView.getPosition();
    
    // Get the latitude and longitude of the new position
    var lat = newPosition.lat();
    var lng = newPosition.lng();
    
    // Now you can use lat and lng as needed
    console.log("New street view position latitude: " + lat);
    console.log("New street view position longitude: " + lng);
  });

  google.maps.event.addListener(streetView, 'pov_changed', function() {
    // Get the new point of view (pov) of the street view
    var pov = streetView.getPov();
    
    // Get the new pitch and heading
    var pitch = pov.pitch;
    var heading = pov.heading;
    
    // Now you can use pitch and heading as needed
    console.log("New street view pitch: " + pitch);
    console.log("New street view heading: " + heading);
  });

  google.maps.event.addListener(streetView, 'pano_changed', function() {
    // Get the new panorama ID of the street view
    var newPanoId = streetView.getPano();
    
    // Now you can use newPanoId as needed
    console.log("New street view panorama ID: " + newPanoId);
  });
}

initMap();
export {};

*/