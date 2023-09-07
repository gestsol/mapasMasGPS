<template>
   <label class="text-center"><h3>Mi Bus</h3></label>
  <div >
   
       <select class="form-select " v-model="selectedTracker" @change="selectBus">
        <option value="" disabled selected>Selecciona tu BUS</option>
   
      <option v-for="bus in buses" :value="bus.id.toString()" :key="bus.label">
        {{ bus.label }} | {{bus.source.id}}
      </option>
    </select>
    <Mapa v-if="buses_ready" :selectedTracker="selectedTracker" :selectedPatente="selectedPatente" :selectedSource="selectedSource" :trackersOptions="buses"></Mapa>

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
      selectedSource: 0,
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
      console.log("selectedBus", selectedBus);
    },
    async fetch() {
      try {
        const resultado = await axios.get("https://masgps-bi.wit.la/buses/miBusLasCondes.php");
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
  background: rgb(174, 173, 179);
}

.form-select {
  width: 100%;
}
</style>

