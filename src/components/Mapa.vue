<template>
  <h1>mapa</h1>
  <GMapMap
    :center=mapCenter
    :zoom=mapZoom
    map-type-id="roadmap"
    style="width: 100vw; height: 500px"
  >

<GMapMarker :v-model="positionBus" :position="positionBus" ></GMapMarker>
      
</GMapMap>

</template>

<script>
//import { GmapMap, GmapMarker } from '@fawmi/vue-google-maps';
//import { io } from 'socket.io-client';
//import { ref, onMounted, onUnmounted,  watchEffect } from "vue";
export default {
name: 'Mapa',
data() {
    return {
      mapCenter: { lat: -33.4132183, lng: -70.5406616 }, // Coordenadas del centro del mapa
      mapZoom: 10, // Nivel de zoom del mapa
      coordenadas:{},
      positionBus : { lat: 0, lng: 0 },
      trackers:10176445

    }
  },

  
mounted() {
        let socket =new WebSocket ("wss://masgps.witservices.io/api-v2/event/subscription");
        let message={"action":"subscribe","hash":"a42aea049190363eb6e21ecc954600b6","events":["state"],"trackers":[this.trackers]};

        socket.onopen = function(e) {

  socket.send(JSON.stringify(message));
};

socket.onmessage = function(event) {
  
    const tramaGps = JSON.parse(event.data);

    if(tramaGps.data.hasOwnProperty('gps')){

      this.positionBus = tramaGps.data.gps.location;
     this.coordenadas=tramaGps.data.gps.location;
      let tracker=tramaGps.data.source_id;

    console.log(this.coordenadas);
    console.log(tracker);
    }

};

  

    },
  
    

}

</script>



<style>

</style>