<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.add_new_product") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input
            col="12"
            identifier="admin_image"
            :placeholder="$t('PLACEHOLDERS.personalImage')"
            @selectImage="selectImage"
            required
            :preSelectedImage="data.image.path"
          />
          <!-- End:: Image Upload Input -->
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.product_name')"
            v-model.trim="data.name"
            @input="validateInput"
            required
          />
          <!-- End:: Name Input -->
          <!-- Start:: Price Input -->
          <base-input
            col="6"
            type="number"
            @input="removeArabicCharacters"
            :placeholder="$t('PLACEHOLDERS.price')"
            v-model.trim="data.price"
            required
          />
          <!-- End:: Price Input -->
          <!-- Start:: delivery number Input -->
          <base-input
            col="6"
            type="number"
            @input="removeArabicCharacters"
            :placeholder="$t('PLACEHOLDERS.delivery_number')"
            v-model.trim="data.deliveryNumber"
            required
          />
          <!-- End:: delivery number Input -->
          <base-select-input
            col="6"
            :optionsList="mainCategory"
            :placeholder="$t('PLACEHOLDERS.product_category')"
            v-model="data.category"
          />
          <!-- End:: Product Category Input -->
          <ImageFileUplaod
            :initialFileUrl="data.initialFileUrl"
            @file-upload="handleFileUpload"
            :buttonText="$t('PLACEHOLDERS.Upload_Menu')"
          />
          <!-- Start:: product category Input -->
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
import ImageFileUplaod from "../../../components/ui/ImageFileUpload.vue";
import { Vue2Dropzone } from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  name: "CreateCity",
  components: {
    Vue2Dropzone,
    ImageFileUplaod,
  },
  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      EnRegex: /[\u0600-\u06FF]/,
      dropzoneOptions: {
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: { "My-Awesome-Header": "header value" },
      },
      // Start:: Data Collection To Send
      data: {
        name: null,
        nameEn: null,
        active: true,
        category: null,
        selectedFile: null,
        deliveryNumber: null,
        image: {
          path: null,
          file: null,
        },
        initialFileUrl: "", // URL of the initially fetched file
      },
      mainCategory: [],

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
    // Start:: validate Form Inputs
    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image
    handleFileUpload(file) {
      this.data.selectedFile = file;
    },
    onDropzoneSuccess(file) {
      console.log("File uploaded successfully!", file);
    },

    validateFormInputs() {
      this.isWaitingRequest = true;

      // if (!this.data.nameAr) {
      //   this.isWaitingRequest = false;
      //   this.$message.error(this.$t("VALIDATION.nameAr"));
      //   return;
      // }
      // else if (!this.data.nameEn) {
      //   this.isWaitingRequest = false;
      //   this.$message.error(this.$t("VALIDATION.nameEn"));
      //   return;
      // }

      // else {
      this.submitForm();
      // return;
      // }
    },
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `products/${this.$route.params.id}`,
        });
        // this.data.nameAr = res.data.data.ProductCategory.name_ar;
        // this.data.nameEn = res.data.data.ProductCategory.name_en;
        this.data.image.path = res.data.data.Product.image;

        this.data.category = res.data.data.Product.product_category;
        this.data.price = res.data.data.Product.price;
        this.data.name = res.data.data.Product.name;

        this.data.deliveryNumber = res.data.data.Product.delivery_number;
        this.data.initialFileUrl = res.data.data?.Product?.menu;
        this.data.active = res.data.data.Product.is_active;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      if (this.data.image?.file) {
        REQUEST_DATA.append("image", this.data.image.file);
      }
      if (this.data.selectedFile) {
        REQUEST_DATA.append("menu", this.data.selectedFile);
      }
      REQUEST_DATA.append("name", this.data.name);
      REQUEST_DATA.append("delivery_number", this.data.deliveryNumber);
      REQUEST_DATA.append("price", this.data.price);
      REQUEST_DATA.append("product_category_id", this.data.category?.id);
      REQUEST_DATA.append("is_active", +this.data.active);
      REQUEST_DATA.append("_method", "PUT");

      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `products/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/products/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // start main category
    async getMainCategories() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/product-categories?page=0`,
        });
        // console.log("Cities =>", res.data.data);
        this.mainCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end main category
    // End:: Submit Form
  },

  created() {
    this.getMainCategories();
    this.showData();
  },
};
</script>
