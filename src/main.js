import { createApp } from 'vue'
import App from './App.vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'


//createApp(App).mount('#app')

const app = createApp(App);
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyAfLNIHZHdf9ZDKnEP9z3M-lK9C-ryRodU',
        // language: 'de',
    },
    autobindAllEvents: true,
}).mount('#app')

