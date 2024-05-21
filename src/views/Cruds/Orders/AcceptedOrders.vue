<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.accept_order") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <form @submit.prevent="submitForm">
      <div>
        <h5 v-for="product in products">
          <div>
            {{ product.item.name }}

            <!-- {{ product.item. }} -->
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
            <!-- start provide list -->
            <base-select-input
              col="6"
              :optionsList="providerlist"
              :placeholder="$t('PLACEHOLDERS.providers')"
              v-model="data.provider"
            />
            <!-- end provide list-->
          </div>
        </h5>
      </div>

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
    </form>

    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "EditRegion",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      EnRegex: /[\u0600-\u06FF]/,
      products: [],
      datePicker: null,
      timePicker: null,
      providerlist: [],
      // Start:: Data Collection To Send
      data: {
        nameAr: null,
        nameEn: null,
        active: null,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
      getCountriesData: "ApiGetsModule/allCountriesData",
    }),
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getCountries: "ApiGetsModule/getCountries",
    }),
    // End:: Vuex Actions

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.nameAr) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      } else if (!this.data.nameEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs
    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.nameAr = this.data.nameAr.replace(/[^\u0600-\u06FF\s]/g, "");
    },
    removeArabicCharacters() {
      this.data.nameEn = this.data.nameEn.replace(this.EnRegex, "");
    },
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("status", "approved");
      this.products.forEach((el, index) => {
        console.log("first,", el.item.name);
        REQUEST_DATA.append(`assigned_providers[${index}][item_id]`, el.id);
        REQUEST_DATA.append(
          `assigned_providers[${index}][delivery_date]`,
          `${this.datePicker} ${this.timePicker}:00`
        );
        REQUEST_DATA.append(
          `assigned_providers[${index}][assigned_type]`,
          `admin`
        );
        // formData.append(`products[${index}][quantity]`, el.quantity);
        // this.data.provider
        //   ? formData.append(
        //       `products[${index}][provider_id]`,
        //       this.data.provider.id
        //     )
        //   : formData.append(
        //       `products[${index}][delivery_date]`,
        //       `${this.datePicker} ${this.timePicker}:00`
        //     );
      });

      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `orders/accept-reject/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.acceptedSuccessfully"));
        this.$router.push({ path: "/accepted-orders/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
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
    // start show data
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `orders/${this.$route.params.id}`,
        });
        const { data } = res.data;
        this.products = data.Order.items.products;
        console.log("products", this.products);
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end show data
  },

  created() {
    // Start:: Fire Methods
    this.showData();
    this.getProviders();
    // End:: Fire Methods
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
