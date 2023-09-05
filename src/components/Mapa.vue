<template>
  <div>
    <div class="card mt-1">
      <div class="card-header">
        <b>Mi BUS</b>
      </div>
      <div class="card-body">
        <h5 class="card-title">{{ selectedPatente }} - {{ selectedSource }} - {{ selectedTracker }} - {{ tramaSource }}</h5>
        <p>La distancia es: <b>{{ distance }}</b> km</p>
        <p>El tiempo estimado de espera es de: <b>{{ demora }}</b> min</p>
        <span>{{ source }}</span>
      </div>
    </div>

    <h6></h6>

    <GMapMap v-if="selectedSource !== null" :center="mapCenter" :zoom="mapZoom" map-type-id="roadmap" style="width: 100%; height: 500px">
      <GMapMarker :position="positionBus"></GMapMarker>
      <GMapMarker :position="Paradero"></GMapMarker>
    </GMapMap>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";

export default {
  name: 'Mapa',
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
    }
  },
  data() {
    return {
      mapCenter: { lat: -33.4132183, lng: -70.5406616 },
      mapZoom: 14,
      coordenadas: {},
      source: null,
      positionBus: { lat: -33.4132183, lng: -70.5406616 },
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

            let lat2 = this.Paradero.lat;
            let lon2 = this.Paradero.lng;

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

