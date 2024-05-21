<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_Offer") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <base-image-upload-input
            col="12"
            identifier="image"
            :placeholder="$t('PLACEHOLDERS.image')"
            :preSelectedImage="data.image.path"
            @selectImage="selectImage"
            required
            disabled
          />

          <!-- Start:: Name Input -->
          <!-- <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.service_provider_name')"
            v-model.trim="data.name"
            required
          /> -->
          <!-- End:: Name Input -->
          <!-- Start:: storeName Input -->
          <base-select-input
            :optionsList="ProvidersList"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.provider_name')"
            v-model.trim="data.provider"
            disabled
          />
          <!-- End:: storeName Input -->

          <!-- Start:: Name Input -->
          <base-picker-input
            col="6"
            type="date"
            :disabledDate="disabledDate"
            :placeholder="$t('PLACEHOLDERS.startDate')"
            v-model.trim="data.publish_start_date"
            required
            disabled
          />

          <base-picker-input
            col="6"
            type="date"
            :disabledDate="disabledDate"
            :placeholder="$t('PLACEHOLDERS.end_date')"
            v-model.trim="data.publish_end_date"
            required
            disabled
          />

          <!-- End:: Name Input -->

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="
                data.active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.active"
              hide-details
              disabled
            ></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->

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
import moment from "moment";

export default {
  name: "CreateStore",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        name_ar: null,
        name_en: null,
        offer_value: null,
        active: true,
        discount: null,
        package: null,
        publish_start_date: null,
        publish_end_date: null,
        provider: null,
      },

      allPackages: [],
      providerlist: [],
      provider: [],
      ProvidersList: [],

      // End:: Data Collection To Send
    };
  },

  computed: {},

  methods: {
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.publish_start_date) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.startDate"));
        return;
      } else if (!this.data.publish_end_date) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.endDate"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs
    // start all offers data

    async getOffersData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `offers/${this.$route.params.id}`,
        });
        this.data.image.path = res.data.data.Offer?.offer;
        this.data.provider = res.data.data.Offer?.provider;
        this.data.publish_start_date = res.data.data.Offer?.start_date;
        this.data.publish_end_date = res.data.data.Offer?.end_date;
        this.data.active = res.data.data.Offer?.is_active;
        // console.log(res.data.data.offer)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // end all offers data

    // Start:: get providers
    async getProviders() {
      try {
        const res = await this.$axios({
          method: "GET",
          url: `/providers?isActive=1&page=0&limit=0`,
          params: {
            // product:
          },
        });
        this.ProvidersList = res.data.data;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: get providers
    async getAllPackages() {
      this.loading = true;
      this.data.vehicle_id = null;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `packages`,
          params: {
            status: 1,
          },
        });
        this.allPackages = res.data.data;
        // console.log(res.data.data)
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
  },

  created() {
    // Start:: Fire Methods
    // this.getStores();
    this.getProviders();
    this.getOffersData();
    // End:: Fire Methods
  },
};
</script>
