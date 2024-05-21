import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDi05AuHRzqhdbobOGhracZ1LY0S-r3rz4",
    libraries: "places",
  },
});
