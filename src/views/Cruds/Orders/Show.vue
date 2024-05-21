<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.view_order_data") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.order_num')"
            v-model.trim="data.orderNumber"
            disabled
          />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('Created_at')"
            v-model.trim="data.createdAt"
            disabled
          />
          <!-- End:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.productName')"
            v-model.trim="data.productName"
            disabled
            required
          />
          <!-- End::product Name Input -->
          <!-- Start::category Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.mainCategory"
            disabled
            required
          />
          <!-- End:: category Input -->

          <!-- Start:: subcategory Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.sub_category')"
            v-model="data.subCategory"
            disabled
            required
          />
          <!-- End:: subcategory Input -->

          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.price')"
            v-model.trim="data.price"
            disabled
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.weight')"
            v-model.trim="data.weight"
            disabled
          />

          <base-input
            col="6"
            type="number"
            :placeholder="$t('PLACEHOLDERS.measure')"
            v-model.trim="data.measure"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.unit')"
            v-model.trim="data.unit"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.desc')"
            v-model.trim="data.desc"
            disabled
          />

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
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "showRegion",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        clientPhone: null,
        nameEn: null,
        country_id: null,
        active: null,
        orderNumber: null,
        createdAt: null,
        price: null,
        mainCategory: null,
        subCategory: null,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {},

  methods: {
    // start show data
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `orders/${this.$route.params.id}`,
        });
        this.data.orderNumber = res.data.data.Order.order_number;
        this.data.createdAt = res.data.data.Order.created_at;
        this.data.productName = res.data.data.Order.items.products.map(
          (item) => item.item.name
        );
        this.data.mainCategory = res.data.data.Order.category.name;
        this.data.subCategory = res.data.data.Order.sub_category.name;
        this.data.price = res.data.data.Order.total;
        this.data.measure = res.data.data.Order.measure;
        this.data.unit = res.data.data.Order.unit.name;
        this.data.desc = res.data.data.Order.description;
        this.data.weight = res.data.data.Order.weight.name;
        this.data.nameEn = res.data.data.Order.name_en;
        this.data.active = res.data.data.Order.is_active;
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
    // End:: Fire Methods
  },
};
</script>
