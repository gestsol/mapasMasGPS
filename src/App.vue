<template>
  
  <div >
    
    <div>
      <select class="form-select " v-model="selectedParada" style="background: red; color: white;" >
        <option value="" disabled selected >Elija su Paradero ?</option>
        <option v-for="(item,index) in paraderos" :value="[item.coord.lat ,item.coord.lng]" :key="index">
          
          {{ item.paradero }} | {{ item.direccion }}
        </option>
    </select>
  
   
  

   

       <select class="form-select " v-model="selectedTracker" @change="selectBus">
        <option value="" disabled selected>Elija su Recorrido ?</option>
        <option v-for="bus in buses" :value="bus.id" :key="bus.label">
        {{ bus.label }} | {{ bus.id_source }}
        </option>
    </select>
  
    </div>

    

    <Mapa v-if="buses_ready" 
    :hash="hash"
    :selectedSource="selectedSource"
    :trackersOptions="buses"
    :selectedParada="selectedParada"
    :selectedPatente="selectedPatente"
    :BusCoord="BusCoord"
    @cambiar-prop="actualizarValorProp"
    
    ></Mapa>

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
      selectedSource: 0,
      selectedTracker: '',
      selectedPatente: '',

      selectedParada:'',
      paraderos:[] ,
      paradero:'',
      BusCoord:[-33.4132183, -70.5406616],      
      
    }
  },
  created() {
    this.fetch();
    this.fetch2();
    this.leerParadas();
  },
  methods: {

    actualizarValorProp(nuevoValor) {
      this.BusCoord = nuevoValor;
      console.log(this.BusCoord)
    },

    selectBus() {
      const selectedBus = this.buses.find(bus => bus.id === parseInt(this.selectedTracker));
      this.selectedSource = selectedBus.id_source;
      this.selectedPatente = selectedBus.label;
      this.BusCoord = [selectedBus.BusCoord.lat,selectedBus.BusCoord.lng] ;
      console.log("selectedBus", selectedBus, this.BusCoord);
    },

    async fetch() {//busca la lista de buses de las condes***
      try {
        
        const resultado = await axios.get("https://masgps-bi.wit.la/buses/lpf-lascondesLite.php");
        this.buses = resultado.data.list;
       // console.log(this.buses);
        this.buses_ready = true
      } catch (error) {
        console.log(error);
      }
    },

    async fetch2() { //Busca el Hash guarado en bbdd ***
      try {
        const hash = await axios.get("https://masgps-bi.wit.la/buses/hashLasCondes.php");
        this.hash = hash.data.hash;
        console.log(this.hash);
      } catch (error) {
        console.log(error);
      }
    },

    
    async leerParadas() {//busca una lista de paraderos en bbdd
      try {
        const paradas = await axios.get("https://masgps-bi.wit.la/buses/paraderosLasCondes.php");
        this.paraderos = paradas.data;
        console.log(this.paraderos);
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
