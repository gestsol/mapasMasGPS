<template>
  {{ selectedParada }}
  <div>
    <div class="">
      <div style="height:600px; width:100%">
        <l-map ref="map" v-model:zoom="zoom" :center="center">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            name="OpenStreetMap"></l-tile-layer>

          <l-marker :lat-lng="selectedParada"></l-marker>
          <l-marker :lat-lng="markerCoords"></l-marker>


        </l-map>
      </div>
    </div>



    <div class="card ">
      <div class="card-header">
        <b>pat</b>
      </div>
      <div class="card-body">

        <b>{{ distance || '...Calculando %...' }}</b> km y <b>{{ demora || '...Calculando %...' }}</b> min de distancia

      </div>
    </div>


  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";


import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer ,LMarker, LIcon} from "@vue-leaflet/vue-leaflet";



export default {
  name: 'Mapa',

  components :{
    LMap,
      LTileLayer,
      LMarker,
      LIcon
  },
  
  props: {

   
    hash:{
      type:String ,
      required: true
    },
    selectedSource: {
      type: Number,
      required: true
    },
     trackersOptions: {
      type: Object,
      required: true
    },
    selectedParada:{
      type:String,
      default: function () {
        return [-33.4132183, -70.5406616];
      }
    },
    /*
    selectedPatente:{
      type:String,
      //required: true
    },
    */
    



  },
  data() {
    return {
      
      trackers: [],
      distance: null,
      demora: null,
      zoom: 15,
      center: [-33.4132183, -70.5406616],
      markerCoords: [-33.4132183, -70.5406616],  
      paraderos:this.selectedParada || [-33.4132183, -70.5406616]
    
    
     }
  },
  methods: {
    conectar() {
      let socket = new WebSocket("wss://masgps.witservices.io/api-v2/event/subscription");
      let message = { "action": "subscribe", "hash": this.hash, "events": ["state"], "trackers": this.trackers };

      socket.onopen = (e) => {
        socket.send(JSON.stringify(message));
      };
      socket.onmessage = (event) => {
        const tramaGps = JSON.parse(event.data);
        if (tramaGps.data.hasOwnProperty('gps')) {
  
          console.log(tramaGps.data.source_id, this.selectedSource)
          if (tramaGps.data.source_id === this.selectedSource) {
            function degToRad(deg) {
              return deg * (Math.PI / 180);
            }

            this.mapCenter = tramaGps.data.gps.location;

            this.markerCoords=[this.mapCenter.lat, this.mapCenter.lng];
            this.center=[this.mapCenter.lat, this.mapCenter.lng];
            

            //this.$emit('cambiar-prop',tramaGps.data.gps.location);
           // this.$emit('cambiar-prop',this.center);

            let lat1 = tramaGps.data.gps.location.lat;
            let lon1 = tramaGps.data.gps.location.lng;

            let lat2 = this.selectedParada[0];
            let lon2 = this.selectedParada[1];

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
    },

  },
  mounted() {
    this.trackers = this.trackersOptions.map(item => item.id);
    console.log(this.trackersOptions);
    this.conectar();
  }
}
</script>

<style>
</style>

