<template>
  <div>
  
   
    <GoogleMap
      api-key="AIzaSyAfLNIHZHdf9ZDKnEP9z3M-lK9C-ryRodU"
      style="width: 100%; height: 500px"
      :center="mapCenter"
      :zoom="15"
    >
      
        <CustomMarker :options="{ position: positionBus, anchorPoint: 'BOTTOM_CENTER' }">
              <div  >
                <span style="background: rgb(255, 0, 0); color: white;" ><b> {{ selectedPatente }}</b></span>
                <svg style="width: 25px; height: 25px; "  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 0C422.4 0 512 35.2 512 80V96l0 32c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32v32c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32V448H192v32c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h0V96h0V80C64 35.2 153.6 0 288 0zM128 160v96c0 17.7 14.3 32 32 32H272V128H160c-17.7 0-32 14.3-32 32zM304 288H416c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H304V288zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16s7.2 16 16 16H368c8.8 0 16-7.2 16-16z"/></svg>
              </div>
        </CustomMarker>

        <CustomMarker :options="{ position: selectedParada, anchorPoint: 'BOTTOM_CENTER' }">
              <div  >
                <span style="background: rgb(255, 0, 0); color: white;" ><b>Paradero</b></span>
                <svg style="width: 25px; height: 25px ;" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/></svg>
                </div>
        </CustomMarker>

  


   
    </GoogleMap>




    <div class="card ">
      <div class="card-header">
        <b>{{ selectedPatente }}</b>
      </div>
      <div class="card-body">
   
         <b>{{ distance }}</b> km y <b>{{ demora }}</b> min de distancia
      </div>
    </div>


  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";

import { GoogleMap, CustomMarker } from "vue3-google-map"; 



export default {
  name: 'Mapa',

  components :{ GoogleMap, CustomMarker ,},
  
  props: {
    selectedSource: {
      type: Number,
      required: true
    },
    selectedPatente: {
      type: String,
      required: true
    },
    selectedTracker: {
      type: String,
      required: true
    },
    trackersOptions: {
      type: Object,
      required: true
    },

    selectedParada:{
      type:Object,
      required: true
    }



  },
  data() {
    return {
      mapCenter: { lat: -33.4132183, lng: -70.5406616 },
      mapZoom: 14,
      coordenadas: {},
      source: null,
      positionBus: { lat: 0, lng: 0},
      Paradero: { lat: -33.4132183, lng: -70.5406616 },
      trackers: [10176497, 10176427, 10105327, 10176442, 10176445, 10177113, 10176440, 10176496, 10177113],
      distance: null,
      demora: null,
      tramaSource: 0
    }
  },
  methods: {
    conectar() {
      let socket = new WebSocket("wss://masgps.witservices.io/api-v2/event/subscription");
      let message = { "action": "subscribe", "hash": "a42aea049190363eb6e21ecc954600b6", "events": ["state"], "trackers": this.trackers };

      socket.onopen = (e) => {
        socket.send(JSON.stringify(message));
      };
      socket.onmessage = (event) => {
        const tramaGps = JSON.parse(event.data);
        if (tramaGps.data.hasOwnProperty('gps')) {
          this.tramaSource = tramaGps.data.source_id
          console.log(tramaGps.data.source_id, this.selectedSource)
          if (tramaGps.data.source_id === this.selectedSource) {
            function degToRad(deg) {
              return deg * (Math.PI / 180);
            }
            this.positionBus = tramaGps.data.gps.location;
            this.source = tramaGps.data.source_id;
            this.mapCenter = tramaGps.data.gps.location;

            let lat1 = tramaGps.data.gps.location.lat;
            let lon1 = tramaGps.data.gps.location.lng;

            let lat2 = this.selectedParada.lat;
            let lon2 = this.selectedParada.lng;

            const radioTierra = 6371;
            const dLat = degToRad(lat2 - lat1);
            const dLon = degToRad(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distancia = radioTierra * c;
            this.distance = distancia.toFixed(2);
            const tiempo = distancia * 3;
            this.demora = tiempo.toFixed(2);
          }
        }
      }
    }
  },
  mounted() {
    this.trackers = this.trackersOptions.map(item => item.id);
    this.conectar();
  }
}
</script>

<style>
</style>

