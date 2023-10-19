<template>
    <div id="map"></div>
  </template>
  
  <script>
  import L from 'leaflet';
  
  export default {
    mounted() {
      // Coordenadas para centrar el mapa (puedes cambiarlas según tus necesidades)
      const mapCenter = [-33.4132183, -70.5406616];
  
      // Crea un mapa con Leaflet
      const map = L.map('map').setView(mapCenter, 13);
  
      // Añade una capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
  };
  </script>
  
  <style>
  #map {
    height: 400px; /* Ajusta la altura según tus necesidades */
  }
  </style>