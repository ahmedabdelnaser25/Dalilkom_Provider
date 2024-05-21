<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.Orders.add") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: adressName Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.address_name')"
            v-model.trim="data.address_name"
            required
          />
          <!-- End:: adressName Input -->
          <!-- Start:: clients Input -->
          <base-select-input
            col="6"
            :placeholder="$t('PLACEHOLDERS.clientPhone')"
            :optionsList="clientsMobile"
            v-model.trim="data.client_id"
            :taggable="true"
            @tag="addNewClient"
          />
          <!-- End:: clients Input -->
          <base-button
            class="mt-2"
            styleType="primary_btn"
            :btnText="$t('BUTTONS.save')"
            v-if="data.showClientBtn"
            @click="$router.push('/clients/create')"
          />

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            required
          />
          <!-- End:: Name Input -->
          <!-- start mobile Input -->
          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.phoneRecipient')"
            v-model.trim="data.mobile"
            required
          />
          <!-- end mobile Input -->
          <!-- Start:: region Input -->
          <base-select-input
            col="6"
            :placeholder="$t('TABLES.Areas.name')"
            :optionsList="getRegionsData"
            v-model.trim="data.region_id"
            @input="getCities"
          />
          <!-- End:: region Input -->

          <!-- {{ getCitiesData }} -->

          <base-select-input
            col="6"
            :optionsList="CitiesData"
            :placeholder="$t('SIDENAV.Cities.name')"
            v-model="data.city_id"
            @input="getGoldenAndDistricts"
          />
          <base-select-input
            col="6"
            :optionsList="DistrictsData"
            :placeholder="$t('PLACEHOLDERS.neighborhood_name')"
            v-model="data.district_id"
          />

          <!-- start category -->
          <base-select-input
            col="6"
            :optionsList="mainCategory"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.mainCategory"
            @input="getSubCategories"
          />
          <!-- end category -->
          <!-- start sub category -->
          <base-select-input
            col="6"
            :optionsList="subCategory"
            :placeholder="$t('PLACEHOLDERS.sub_category')"
            v-model="data.subCategory"
            @input="getProducts"
          />
          <!-- end sub category -->
          <!-- start products -->
          <base-select-input
            col="6"
            :optionsList="productsData"
            :placeholder="$t('PLACEHOLDERS.products')"
            v-model="data.product"
            @input="getProviders"
          />
          <!-- end products -->
          <!-- datePicker -->
          <v-col cols="6">
            <label for="birthday" class="mx-2">{{
              $t("PLACEHOLDERS.choose_date")
            }}</label>
            <input
              class="date-input"
              type="date"
              id="birthday"
              name="birthday"
              v-model="datePicker"
            />
          </v-col>
          <!-- datePicker -->
          <!-- timePicker -->
          <v-col cols="6">
            <label for="appt" class="mx-2">{{
              $t("PLACEHOLDERS.choose_delivery_time")
            }}</label>
            <input
              class="date-input"
              type="time"
              id="appt"
              name="appt"
              v-model="timePicker"
            />
          </v-col>
          <!-- timePicker -->
          <!-- Start:: golden Input -->
          <base-select-input
            v-if="goldenOffers.length > 0"
            col="6"
            :placeholder="$t('PLACEHOLDERS.golden_offers')"
            :optionsList="goldenOffers"
            v-model.trim="data.goldenOffers"
          />
          <!-- End:: golden Input -->
          <!-- start provide list -->
          <base-select-input
            col="6"
            :optionsList="providerlist"
            :placeholder="$t('PLACEHOLDERS.providers')"
            v-model="data.provider"
          />
          <!-- end provide list-->

          <!-- start:: table -->
          <v-data-table
            class="thumb"
            :loading="loading"
            :loading-text="$t('TABLES.loadingData')"
            :search="searchValue"
            :headers="tableHeaders"
            :items="tableRows"
            item-class="ltr"
            hide-default-footer
          >
            <template v-slot:[`item.quantity`]="{ item }">
              <button type="button" @click="handleQuantity('increment', item)">
                +
              </button>
              <span>{{ item.quantity }}</span>
              <button type="button" @click="handleQuantity('decrement', item)">
                -
              </button>
            </template>
            <template v-slot:[`item.action`]="{ item, index }">
              <button type="button" @click="removeRowItem(index)">
                remove
              </button>
            </template>
          </v-data-table>
          <!-- end::table -->
          <!-- start golden table -->
          <v-data-table
            class="thumb mt-3"
            :loading="loading"
            :loading-text="$t('TABLES.loadingData')"
            :search="searchValue"
            :headers="tableGoldenHeaders"
            :items="tableRowsGolden"
            item-class="ltr"
            hide-default-footer
          >
            <template v-slot:[`item.quantity`]="{ item }">
              <button type="button" @click="handleQuantity('increment', item)">
                +
              </button>
              <span>{{ item.quantity }}</span>
              <button type="button" @click="handleQuantity('decrement', item)">
                -
              </button>
            </template>
            <template v-slot:[`item.action`]="{ item, index }">
              <button type="button" @click="removeRowItem(index)">
                remove
              </button>
            </template>
          </v-data-table>
          <!-- end golden table -->
          <!-- start google maps -->
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
          <!-- end google maps -->
          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CreateCity",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      tableRows: [],
      providerlist: [],

      tableRowsGolden: [],
      // Start:: Data Collection To Send
      data: {
        name: null,
        mobile: null,
        city_id: null,
        region_id: null,
        district_id: null,
        showClientBtn: false,
        subCategory: null,
        mainCategory: null,
        address_name: null,
        product: {},
        goldenOffers: null,
        provider: null,
        golden_offers: [],
      },
      timePicker: null,
      datePicker: null,
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
      CitiesData: [],
      getRegionsData: [],
      DistrictsData: [],
      mainCategory: [],
      subCategory: [],
      productsData: [],
      goldenOffers: [],
      clientsMobile: [],
      tableHeaders: [
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
          text: this.$t("PLACEHOLDERS.product_quantity"),
          value: "quantity",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.price"),
          value: "price",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.actions"),
          value: "action",
          sortable: false,
          align: "center",
        },
      ],
      tableGoldenHeaders: [
        {
          text: this.$t("TABLES.StoresTypes.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Golden.name"),
          value: "name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.product_quantity"),
          value: "quantity",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.price"),
          value: "price",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.actions"),
          value: "action",
          sortable: false,
          align: "center",
        },
      ],
      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  methods: {
    removeRowItem(index) {
      this.$delete(this.tableRows, index);
    },
    // start golden and districts
    handleQuantity(type, item) {
      if (type === "increment") {
        item.quantity++;
      } else {
        console.log(type);
        if (item.quantity > 1) {
          item.quantity--;
        }
      }
    },
    getGoldenAndDistricts() {
      this.getDisticts();
      this.getGoldenOffers();
    },
    // end golden and districts
    // Start:: validate Form Inputs
    // start google maps
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
    // end google maps
    generateFormData() {
      const formData = new FormData();
      for (const key in this.data) {
        if (typeof this.data[key] == "object") {
          this.data[key] &&
            this.data[key]["id"] &&
            formData.append(key, this.data[key]["id"]);
        } else {
          formData.append(key, this.data[key]);
        }
      }
      formData.append(`delivery_date`, `${this.datePicker} ${this.timePicker}`);

      formData.append(`golden_offers`, []);
      formData.append(`lat`, "23.15");
      formData.append(`lng`, "28.15");
      // formData.append(`products[0][delivery_date]`, "2024-06-15 12:22:00");
      this.tableRows.forEach((el, index) => {
        formData.append(`products[${index}][product_id]`, el.id);
        formData.append(`products[${index}][quantity]`, el.quantity);
        this.data.provider
          ? formData.append(
              `products[${index}][provider_id]`,
              this.data.provider.id
            )
          : formData.append(
              `products[${index}][delivery_date]`,
              `${this.datePicker} ${this.timePicker}:00`
            );
      });

      // this.tableRowsGolden.forEach((el, index) => {
      //   if (el.length > 1) {
      //     formData.append(`golden_offers[${index}][golden_offer_id]`, el.id);
      //   } else {
      //     formData.append(`golden_offers[]`, null);
      //   }
      //   // formData.append(`golden_offers[${index}][quantity]`, el.quantity);
      //   el.provider_id
      //     ? formData.append(
      //         `golden_offers[${index}][provider_id]`,
      //         el.provider_id
      //       )
      //     : formData.append(
      //         `golden_offers[${index}][delivery_date]`,
      //         el.delivery_date
      //       );
      // });

      return formData;
    },
    async validateFormInputs() {
      await this.$axios.post("orders", this.generateFormData());
      this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
      this.$router.push({ path: "/orders/all" });
      // this.isWaitingRequest = true;

      // if (!this.data.name) {
      //   this.isWaitingRequest = false;
      //   this.$message.error(this.$t("VALIDATION.name"));
      //   return;
      // } else {
      //   this.submitForm();
      //   return;
      // }
    },
    // End:: validate Form Inputs
    // start regions
    async getRegions() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `regions?isActive=1&page=0&limit=0`,
        });
        // console.log("Cities =>", res.data.data);
        this.getRegionsData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end regions
    // start city
    async getCities() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities?isActive=1&page=0&limit=0`,
          params: {
            region: `${this.data.region_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.CitiesData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // start get districts
    async getDisticts() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `districts?isActive=1&page=0&limit=0`,
          params: {
            city: `${this.data.city_id?.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.DistrictsData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // start main category
    async getMainCategories() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/categories?page=0&limit=0`,
        });
        // console.log("Cities =>", res.data.data);
        this.mainCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end main category
    // start sub category
    async getSubCategories() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/sub-categories?page=0&limit=0`,
          params: {
            category: `${this.data.mainCategory.id}`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.subCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end sub category
    // start products
    async getProducts() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/products?page=0&limit=0`,
          params: {
            category: `${this.data.mainCategory.id}`,
            sub_category: `${
              this.data.subCategory ? this.data.subCategory.id : ""
            }`,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.productsData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end products
    // start Golden
    async getGoldenOffers() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/golden-offers?page=0&limit=0&isActive=1&status=active`,
          params: {
            // category: this.data.mainCategory.id,
            city: this.data.city_id.id,
          },
        });
        this.goldenOffers = res.data.data;
        console.log("goldenOffers", this.goldenOffers);
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end Golden
    async getProviders() {
      // alert('providers')
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/providers?page=0&limit=0`,
          params: {
            product: this.data.product?.id,
            city_id: this.data.city_id?.id,
          },
        });

        this.providerlist = res.data.data;
        this.insertRowTable();
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end providers list
    // start::get clients
    async getClients(item) {
      try {
        const res = await this.$axios({
          method: "GET",
          url: `/clients`,
        });
        this.clientsMobile = res.data.data.map((item) => {
          return {
            id: item.id,
            name: `${item.mobile} - ${item.name} `,
          };
        });
        console.log("response", response);
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // end:: get clients
    // add new Client
    addNewClient() {
      this.data.showClientBtn = true;
    },
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("name", this.data.name);

      try {
        await this.$axios({
          method: "POST",
          url: `weights`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/measure/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
    insertRowTable() {
      const rowIds = this.tableRows.map((el) => el.id);
      let rowData = {};
      // first check if the product exists just return not do anything
      if (!rowIds.includes(this.data.product.id)) {
        // check if there no provider list
        if (!this.providerlist.length) {
          // in case no provider
          rowData = {
            ...this.data.product,
            delivery_date: new Date(),
          };
        } else {
          rowData = {
            ...this.data.product,
            provider_id: this.data.provider.id,
          };
        }
        rowData.quantity = 1;
        this.tableRows.push(rowData);
        this.data.product = null;
        this.data.provider = null;
      }
    },
  },

  created() {
    this.getRegions();
    this.getCities();
    this.getDisticts();
    this.getMainCategories();
    this.getSubCategories();
    this.getProducts();
    this.getGoldenOffers();
    this.getClients();
  },
};
</script>
<style scoped>
label {
  color: #ffa000;
  font-size: 14px;
  font-weight: 500;
}
.date-input {
  border: 1px solid #ffa000;
  padding: 10px 30px;
}
</style>
