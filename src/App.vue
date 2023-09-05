<template>
  <div class="container">
    <Mapa v-if="buses_ready" :selectedTracker="selectedTracker" :selectedPatente="selectedPatente" :selectedSource="selectedSource" :trackersOptions="buses"></Mapa>

    <select class="form-select mt-2" v-model="selectedTracker" @change="selectBus">
      <option v-for="bus in buses" :value="bus.id.toString()" :key="bus.label">
        {{ bus.label }}
      </option>
    </select>
  </div>
</template>

<script>
import Mapa from './components/Mapa.vue';
import axios from "axios";

export default {
  name: 'App',
  components: {
    Mapa,
  },
  data() {
    return {
      buses: [],
      buses_ready: false,
      selectedPatente: '',
      selectedSource: 10103058,
      selectedTracker: ''
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    selectBus() {
      const selectedBus = this.buses.find(bus => bus.id === parseInt(this.selectedTracker));
      this.selectedSource = selectedBus.source.id;
      this.selectedPatente = selectedBus.label;
      console.log(selectedBus);
    },
    async fetch() {
      try {
        const resultado = await axios.post("http://www.trackermasgps.com/api-v2/tracker/list", { "hash": "a42aea049190363eb6e21ecc954600b6" });
        this.buses = resultado.data.list;
        this.buses_ready = true
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
body {
  background: rgb(163, 155, 155);
}

.form-select {
  width: 50%;
}
</style>

