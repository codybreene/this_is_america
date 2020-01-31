import {styles} from './mapStyles';

const country = "United States";
const mapOptions = {
  center: { lat: 39.8283, lng: -98.5795 }, // this is center of US
  zoom: 4,
  draggable: false,
  styles: styles
};


export const initMap = () => {
  const mapDiv = document.getElementById("map-container");
  const map = new google.maps.Map(mapDiv, mapOptions);
  return map
}

export const drawPolygon = (map) => {
  const triangleCoords = [
    { lat: 25.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 25.774, lng: -80.19 }
  ];

  const bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 10,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });
  bermudaTriangle.setMap(map);
}