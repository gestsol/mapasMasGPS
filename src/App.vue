<template>
  
  <div >
    
    <div>
      <select class="form-select " v-model="selectedParada" style="background: red; color: white;" >
        <option value="" disabled selected >Elija su Paradero</option>
        <option v-for="(item,index) in paraderos" :value="item.coord" :key="index">
          {{ item.parada }} | {{ item.address }}
        </option>
    </select>

   

       <select class="form-select " v-model="selectedTracker" @change="selectBus">
        <option value="" disabled selected>Elija su Recorrido</option>
        <option v-for="bus in buses" :value="bus.id.toString()" :key="bus.label">
        {{ bus.label }} 
        </option>
    </select>
    </div>

    <Mapa v-if="buses_ready" :selectedTracker="selectedTracker" :selectedParada="selectedParada" :selectedPatente="selectedPatente" :selectedSource="selectedSource" :trackersOptions="buses" :hash="hash"></Mapa>

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
      hash:'',
      buses: [],
      buses_ready: false,
      selectedPatente: '',
      selectedSource: 0,
      selectedTracker: '',
      selectedParada:'',
      paraderos:[
                  {parada:"Parada 1", coord:{lat:-33.42298,lng:-70.5296783}, address:"Calle larga #123"},
                  {parada:"Parada 2", coord:{lat:-33.4166016,lng:-70.5338083}, address:"Calle larga #123"},
                  {parada:"Parada 3", coord:{lat:-33.4085899,lng:-70.5451316}, address:"Calle larga #123"},
                  {parada:"Parada 4", coord:{lat:-33.40758,  lng:-70.559805}, address:"Calle larga #123"},
                  {parada:"Parada 5", coord:{lat:-33.402755, lng:-70.5143616}, address:"Calle larga #123"},
                  {parada:"Parada 6", coord:{lat:-33.382295, lng:-70.5078683}, address:"Calle larga #123"},
                 
      ]
    }
  },
  created() {
    this.fetch();
    this.fetch2();
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
    },

    async fetch2() {
      try {
        const hash = await axios.get("https://masgps-bi.wit.la/buses/hashLasCondes.php");
        this.hash = hash.data.hash;
        console.log(this.hash);
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

