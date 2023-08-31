<template>
    <div>
      <select class="form-select" v-model="selectedItem"> 
      <option v-for="(item,index) in buses" :key="index" :value="item.id">{{ item.label }}</option>
      </select>
    </div>
  </template>
  
  <script>
  
  import axios from "axios";
  
  export default {
  
      name:'Selector',
      
    data() {
      return {
        buses: [
          
        ],
        selectedItem: null
      }
    },
    
    created (){ 
         this.fetch ()  
        },
  
    methods: {
       async fetch (){
  
      
        try {  
  
          const resultado= await axios.post ("http://www.trackermasgps.com/api-v2/tracker/list",
        {"hash": "a42aea049190363eb6e21ecc954600b6"});
  
        console.log(resultado.data.list);
  
        this.buses =resultado.data.list ;
  
        }catch (error){
  
          console.log(error);
  
  
        }
       }
    },
  }
  </script>
  
  <style>
  
  </style>