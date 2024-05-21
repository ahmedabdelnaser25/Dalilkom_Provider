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
          <base-image-upload-input
            col="12"
            identifier="admin_image"
            :preSelectedImage="data.logo.path"
            :placeholder="$t('PLACEHOLDERS.company_image')"
            @selectImage="selectLogo"
            disabled
          />
          <!-- Start:: Name Input -->
          <base-input
            col="6"
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
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model="data.email"
            disabled
            required
          />
          <!-- End:: email Input -->
          <h4>{{ $t("PLACEHOLDERS.store_data") }}</h4>
          <!-- end::companyName -->
          <base-image-upload-input
            col="6"
            identifier="admin_image"
            :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.store_logo')"
            @selectImage="selectImage"
            disabled
          />
          <v-col cols="12" sm="6" md="6">
            <uploadPhotos :urls="imgUrls" disabled>
              {{ $t("PLACEHOLDERS.store_images") }}
            </uploadPhotos>
          </v-col>

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.store_name')"
            v-model.trim="data.storeName"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.store_description')"
            v-model.trim="data.storeDesc"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.storeNum')"
            v-model.trim="data.storeMobile"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.main_category_name')"
            v-model.trim="data.mainCategory"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.sub_section_name')"
            v-model.trim="data.subCategory"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.commercial_registration_number')"
            v-model.trim="data.commercialRegistration"
            disabled
          />
          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="
                data.marouf
                  ? $t('PLACEHOLDERS.registered_in_marouf')
                  : $t('PLACEHOLDERS.notRegistered_in_marouf')
              "
              v-model="data.marouf"
              disabled
              hide-details
            ></v-switch>
          </div>

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.area')"
            v-model.trim="data.region"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.city')"
            v-model.trim="data.city"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.district')"
            v-model.trim="data.district"
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
      marker: {
        position: { lat: 24.7136, lng: 46.6753 }, // Initial marker position (Riyadh)
      },
      // google maps

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
          url: `provider-requests/${this.$route.params.id}`,
        });
        console.log(res.data.data);
        const { data } = res.data;
        this.data.logo.path = data.Provider.image;
        this.data.providerName = data.Provider.name;
        this.data.mobile = data.Provider.mobile;
        this.data.email = data.Provider.email;
        this.data.companyName = data.Provider.company_name;
        this.data.city = data.Provider.city;
        this.data.region = data.Provider.region;
        this.data.district = data.Provider.district;
        this.data.district = data.Provider.district;
        this.data.iban = data.Provider.iban;
        this.data.bank = data.Provider.bank;
        // this.data.image.path = data.Provider.commercial_registry;
        // this.data.image_2.path = data.Provider.tax_registry;
        // this.data.logo.path = data.Provider.company_logo;
        console.log(data.Provider.lat);
        this.marker = {
          position: {
            lat: Number(data.Provider.lat),
            lng: Number(data.Provider.lng),
          },
        };
        this.center = {
          lat: Number(data.Provider.lat),
          lng: Number(data.Provider.lng),
        };
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end all package data
    selectLogo(selectedImage) {
      this.data.logo = selectedImage;
    },
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
