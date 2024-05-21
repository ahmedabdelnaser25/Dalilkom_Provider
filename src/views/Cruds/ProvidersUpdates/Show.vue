<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_provider_info") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            v-if="data.providerName"
            type="text"
            :placeholder="$t('PLACEHOLDERS.provider_name')"
            v-model.trim="data.providerName"
            disabled
            required
          />
          <!-- End:: Name Input -->
          <!-- Start::phone Input -->
          <base-input
            col="6"
            v-if="data.mobile"
            type="text"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model="data.mobile"
            disabled
            required
          />
          <!-- End:: phone Input -->

          <!-- Start:: email Input -->
          <base-input
            col="6"
            v-if="data.email"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model="data.email"
            disabled
            required
          />
          <!-- End:: email Input -->
          <!-- start::companyName -->
          <base-input
            col="6"
            v-if="data.companyName"
            type="text"
            :placeholder="$t('PLACEHOLDERS.company_name')"
            v-model.trim="data.companyName"
            disabled
          />
          <!-- end::companyName -->

          <base-input
            v-if="data?.region"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.area')"
            v-model.trim="data.region"
            disabled
          />
          <base-input
            v-if="data?.city"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.city')"
            v-model.trim="data.city"
            disabled
          />
          <base-input
            v-if="data?.district"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.district')"
            v-model.trim="data.district"
            disabled
          />
          <base-input
            v-if="data?.bank"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.bank')"
            v-model.trim="data.bank"
            disabled
          />
          <base-input
            v-if="data?.iban"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.iban')"
            v-model.trim="data.iban"
            disabled
          />
          <div class="row">
            <div class="col-12">
              <GmapMap
                :center="center"
                :zoom="7"
                map-type-id="terrain"
                style="width: 100%; height: 300px"
                @click="handleMapClick"
              >
                <GmapMarker
                  :position="marker.position"
                  :clickable="true"
                  :draggable="true"
                  @click="markerClicked"
                  @dragend="markerDragged($event)"
                />
              </GmapMap>
            </div>
          </div>
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CreateStore",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      // Start:: Data Collection To Send
      //   start map

      // end map
      data: {
        image: {
          path: null,
          file: null,
        },
        image_2: {
          path: null,
          file: null,
        },
        logo: {
          path: null,
          file: null,
        },

        providerName: null,
        mobile: null,
        email: null,
        companyName: null,
        city: null,
        region: null,
        district: null,
        unit: null,
        desc: null,
        iban: null,
        bank: null,
      },
      center: { lat: 24.7136, lng: 46.6753 },
      zoom: 10,
      currentPlace: null,
      marker: {
        position: { lat: 24.7136, lng: 46.6753 }, // Initial marker position (Riyadh)
      },
      polylineOptions: {
        strokeColor: "#FF0000", // Red color
        strokeOpacity: 1.0,
        strokeWeight: 2,
        geodesic: true,
      },

      Latitude: "",
      Longitude: "",
      Radius: "",
      place: "",
      marker: {
        position: { lat: 24.7136, lng: 46.6753 }, // Initial marker position (Riyadh)
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allOrderTypes: "ApiGetsModule/allOrderTypesData",
    }),
    // End:: Vuex Getters

    show_image() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.yes"),
          value: 1,
        },
        {
          id: 0,
          name: this.$t("PLACEHOLDERS.no"),
          value: 0,
        },
      ];
    },
  },

  methods: {
    // start all package data
    async getPackageData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `profile-update-request/${this.$route.params.id}`,
        });
        console.log(res.data.data);

        this.data.providerName = res.data.data.Requests.name;
        this.data.mobile = res.data.data.Requests.mobile;
        this.data.email = res.data.data.Requests.email;
        this.data.companyName = res.data.data.Requests.company_name;
        this.data.city = res.data.data.Requests.city?.name;
        this.data.region = res.data.data.Requests.region?.name;
        this.data.district = res.data.data.Requests.district?.name;
        this.data.iban = res.data.data.Requests.iban;
        this.data.bank = res.data.data.Requests.bank;
        this.data.image.path = res.data.data.Requests.commercial_registry;
        this.data.image_2.path = res.data.data.Requests.tax_registry;
        this.data.logo.path = res.data.data.Requests.image;
      } catch (error) {
        this.loading = false;
        // console.log(error.response.data.message);
      }
    },
    // end all package data
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    selectImage_2(selectedImage) {
      this.data.image_2 = selectedImage;
    },
    handleMapClick(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const radius = this.calculateDistance(
        lat,
        lng,
        this.center.lat,
        this.center.lng
      );

      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          this.Latitude = lat;
          this.Longitude = lng;
          this.Radius = radius;
          this.place = results[0].formatted_address;

          console.log("Latitude:", lat);
          console.log("Longitude:", lng);
          console.log("Radius:", radius);
          console.log("Place:", results[0].formatted_address);

          this.marker.position = { lat, lng }; // Update the marker's position
        }
      });
    },

    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371; // Radius of the earth in kilometers
      const dLat = this.deg2rad(lat2 - lat1);
      const dLng = this.deg2rad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Convert to meters
      return distance;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    handleMarkerClick(index) {
      console.log("Marker clicked:", index);
    },

    setPlace(place) {
      this.currentPlace = place;
    },

    markerClicked() {
      // Handle marker click event
      const lat = this.marker.position.lat;
      const lng = this.marker.position.lng;
      const radius = this.calculateDistance(
        lat,
        lng,
        this.center.lat,
        this.center.lng
      );
      console.log("Marker clicked:", lat, lng);
      console.log(radius);
    },

    markerDragged(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.marker.position = { lat, lng };
      const radius = this.calculateDistance(
        lat,
        lng,
        this.center.lat,
        this.center.lng
      );

      this.Latitude = lat;
      this.Longitude = lng;
      this.Radius = radius;

      console.log("Latitude dragged:", lat);
      console.log("Longitude dragged:", lng);
      console.log("Radius dragged:", radius);
    },
  },

  created() {
    // Start:: Fire Methods
    this.getPackageData();
    // End:: Fire Methods
  },
};
</script>
