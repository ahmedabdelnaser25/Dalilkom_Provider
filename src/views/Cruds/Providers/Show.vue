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
            :placeholder="$t('PLACEHOLDERS.provider_image')"
            @selectImage="selectImage"
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
          <!-- start::companyName -->
          <!-- <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.company_name')"
            v-model.trim="data.companyName"
            disabled
          /> -->
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
          <h4 v-if="data?.phones">{{ $t("PLACEHOLDERS.contact_phones") }}</h4>
          <li v-for="number in data?.phones" :key="number">
            <a :href="'tel:+' + number">{{ number }}</a>
          </li>
          <h4 v-if="data?.whatsApp" class="mt-4">
            {{ $t("PLACEHOLDERS.contact_whats") }}
          </h4>
          <a :href="'https://wa.me/' + data?.whatsApp">{{ data.whatsApp }}</a>
          <h4 v-if="socialMedia" class="mt-4">
            {{ $t("PLACEHOLDERS.social_contact") }}
          </h4>
          <ul>
            <li v-for="(social, index) in socialMedia" :key="index">
              <a :href="social.url" target="_blank">
                <i :class="social.icon"></i>
                {{ social.name }}
              </a>
            </li>
          </ul>
          <h4 class="mt-4">
            {{ $t("PLACEHOLDERS.branches") }}
          </h4>
          <v-data-table
            class="thumb"
            :loading="loading"
            :loading-text="$t('TABLES.loadingData')"
            :search="searchValue"
            :headers="tableHeaders"
            :items="tableRows"
            item-class="ltr"
            :items-per-page="paginations.items_per_page"
            hide-default-footer
          >
            <!-- Start:: Activation -->
            <template v-slot:[`item.map`]="{ item }">
              <span class="text-success text-h5" v-if="item.map">
                <button
                  type="button"
                  class="btn_delete"
                  @click="selectMapItem(item.map)"
                >
                  <i class="far fa-map"></i>
                </button>
              </span>
              <span class="text-danger text-h5" v-else>
                <i class="far fa-times"></i>
              </span>
            </template>
            <!-- End:: Activation -->
          </v-data-table>
          <!-- End:: Deactivate Switch Input -->
          <!-- <button @click="openGoogleMaps">Open Google Maps</button> -->
          <base-input
            v-if="data?.iban"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.iban')"
            v-model.trim="data.iban"
            disabled
          />
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UploadPhotos from "../../../components/ui/UploadPhotos.vue";

export default {
  name: "CreateStore",
  components: {
    UploadPhotos,
  },

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      // Start:: Data Collection To Send
      //   start map
      // socialMedia: [
      //   {
      //     name: "Facebook",
      //     url: "https://www.facebook.com",
      //     icon: "fab fa-facebook",
      //   },
      //   {
      //     name: "Instagram",
      //     url: "https://www.instagram.com",
      //     icon: "fab fa-instagram",
      //   },
      //   {
      //     name: "Snapchat",
      //     url: "https://www.snapchat.com",
      //     icon: "fab fa-snapchat",
      //   },
      //   // Add more social media platforms as needed
      // ],
      tableRows: [],
      tableProducts: [],
      tableHeaders: [
        // {
        //   text: this.$t("TABLES.StoresTypes.serialNumber"),
        //   value: "id",
        //   align: "center",
        //   width: "80",
        //   sortable: false,
        // },
        {
          text: this.$t("PLACEHOLDERS.branch_name"),
          value: "name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.desc"),
          value: "description",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.place_on_map"),
          value: "map",
          sortable: false,
          align: "center",
        },
      ],
      productHeaders: [
        {
          text: this.$t("TABLES.StoresTypes.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.product_name"),
          value: "name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.product_category"),
          value: "description",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.product_image"),
          value: "mobile",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.average_product_rating"),
          value: "mobile",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.delivery_number"),
          value: "mobile",
          sortable: false,
          align: "center",
        },
      ],
      marker: {
        position: { lat: 24.7136, lng: 46.6753 }, // Initial marker position (Riyadh)
      },
      imgUrls: [],

      // end map
      data: {
        socialMedia: [],
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
        marouf: null,
        phones: null,
        whatsApp: null,
        providerName: null,
        mobile: null,
        email: null,
        companyName: null,
        city: null,
        region: null,
        storeMobile: null,
        district: null,
        unit: null,
        desc: null,
        iban: null,
        bank: null,
        storeName: null,
        storeDesc: null,
        storeNums: null,
        mainCategory: null,
        subCategory: null,
        commercialRegistration: null,
      },
      // google maps
      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data
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
    selectMapItem(item) {
      const latitude = item.lat;
      const longitude = item.lng;
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(googleMapsUrl, "_blank");
    },
    getIconClass(socialName) {
      // Map social media platform names to Font Awesome icon classes
      switch (socialName.toLowerCase()) {
        case "facebook":
          return "fab fa-facebook";
        case "instagram":
          return "fab fa-instagram";
        case "snapchat":
          return "fab fa-snapchat";
        // Add more cases for other social media platforms as needed
        default:
          return ""; // Return empty string if no matching icon class found
      }
    },
    callNumber(number) {
      window.open("tel:+" + number);
    },
    // start all package data
    async getPackageData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `providers/${this.$route.params.id}`,
        });
        const { data } = res.data;
        const socialMedia = data.Provider.store.social_links;
        this.data.socialMedia = Object.keys(socialMedia).map((key) => ({
          name: key,
          url: socialMedia[key],
        }));

        // console.log("first", this.data.socialMedia);
        this.data.providerName = data.Provider.name;
        this.data.mobile = data.Provider.mobile;
        this.data.storeMobile = data.Provider.store.mobile;
        this.data.email = data.Provider.email;
        this.data.companyName = data.Provider.company_name;
        this.data.storeDesc = data.Provider.store.description;
        this.data.mainCategory = data.Provider.store.category?.name;
        this.data.subCategory = data.Provider.store.sub_category?.name;
        this.imgUrls = data.Provider?.store?.images;
        this.data.phones = data.provider?.store?.phones;
        this.data.whatsApp = data.Provider?.store?.whatsapp;
        this.data.socialMedia = data.Provider?.store?.social_links;
        this.data.storeName = data.Provider.store.name;
        this.data.image.path = data.Provider.store.logo;
        this.data.commercialRegistration =
          data.Provider.store.commercial_register_no;
        this.data.logo.path = data.Provider.image;
        this.data.marouf = data.Provider.store.is_in_maroof;
        this.data.phones = data.Provider.store.phones.phones;
        this.tableRows = data.Provider.store.branches;
        this.tableProducts = data.Provider.store.products;
        console.log("products", data.Provider.store.products);
        // console.log("first", this.tableRows);
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
<style scoped lang="scss">
a {
  font-size: 22px;
}
</style>
