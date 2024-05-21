<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("SIDENAV.advertisement.add") }}</h4>
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
            :placeholder="$t('PLACEHOLDERS.image')"
            @selectImage="selectImage"
            required
          />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.nameAr"
            @input="validateInput"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.nameEn"
            @input="removeArabicCharacters"
            @copy="onCopy"
            @paste="onPaste"
            required
          />

          <!-- End:: Name Input -->
          <base-input
            col="6"
            type="date"
            :placeholder="$t('SIDENAV.advertisement.Start_publich')"
            v-model.trim="data.startDate"
            required
          />

          <base-input
            col="6"
            type="date"
            :placeholder="$t('SIDENAV.advertisement.End_publich')"
            v-model.trim="data.endDate"
            required
          />
          <!-- Start:: type select -->
          <base-select-input
            col="6"
            :optionsList="typeStatuses"
            :placeholder="$t('PLACEHOLDERS.type')"
            v-model="data.type"
            required
          />
          <!-- End:: type select -->
          <base-select-input
            v-if="data.type && data.type.name === $t('STATUS.stores')"
            col="6"
            :optionsList="mainCategory"
            :placeholder="$t('PLACEHOLDERS.main_category')"
            v-model="data.mainCategory"
            @input="getSubCategories"
          />
          <!-- end category -->
          <!-- start sub category -->
          <base-select-input
            v-if="data.type && data.type.name === $t('STATUS.stores')"
            col="6"
            :optionsList="subCategory"
            :placeholder="$t('PLACEHOLDERS.sub_category')"
            v-model="data.subCategory"
          />

          <!-- Start:: Status Input -->
          <base-select-input
            col="6"
            :optionsList="activeStatuses"
            :placeholder="$t('PLACEHOLDERS.status')"
            v-model="data.is_active"
            required
          />
          <!-- End:: Status Input -->
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
import moment from "moment";

export default {
  name: "CreateAdditionalFields",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      mainCategory: [],
      subCategory: [],
      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        nameAr: null,
        nameEn: null,
        startDate: null,
        endDate: null,
        is_active: null,
        type: null,
        mainCategory: null,
        subCategory: null,
      },
      // End:: Data Collection To Send

      arabicRegex: /^[\u0600-\u06FF\s]+$/,
      EnRegex: /[\u0600-\u06FF]/,
    };
  },

  computed: {
    typeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.main"),
          value: "home",
        },
        {
          id: 2,
          name: this.$t("STATUS.stores"),
          value: "stores",
        },
      ];
    },
    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        },
      ];
    },
  },

  methods: {
    // start main category
    async getMainCategories() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/categories?page=0&limit=0`,
          params: {
            isActive: 1,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.mainCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end main category
    async getSubCategories() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/sub-categories?page=0&limit=0`,
          params: {
            category: `${
              this.data.mainCategory ? this.data.mainCategory.id : ""
            }`,
            isActive: 1,
          },
        });
        // console.log("Cities =>", res.data.data);
        this.subCategory = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },

    onCopy(event) {
      event.preventDefault();
    },
    onPaste(event) {
      event.preventDefault();
    },

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    // Start:: validate Form Inputs
    validateFormInputs() {
      // this.isWaitingRequest = true;

      if (this.data?.startDate > this.data?.endDate) {
        this.$message.error(this.$t("VALIDATION.StartDateAndEndDate"));
        this.isWaitingRequest = false;

        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("ad", this.data.image.file);
      REQUEST_DATA.append("name_ar", this.data.nameAr);
      REQUEST_DATA.append("name_en", this.data.nameEn);
      REQUEST_DATA.append("start_date", this.data.startDate);
      REQUEST_DATA.append("end_date", this.data.endDate);
      REQUEST_DATA.append("is_active", this.data.is_active?.value);
      REQUEST_DATA.append("type", this.data.type?.value);
      if (this.data.mainCategory) {
        REQUEST_DATA.append("category_id", this.data.mainCategory?.id);
      }
      if (this.data?.subCategory) {
        REQUEST_DATA.append("sub_category_id", this.data.subCategory?.id);
      }

      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `ad-spaces`,
          data: REQUEST_DATA,
          params: {
            status: 1,
          },
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/advertisements/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  created() {
    // Start:: Fire Methods
    // this.showVehicleTypes();
    this.getMainCategories();
    // this.getSubCategories();
    // End:: Fire Methods
  },
};
</script>

<style lang="scss" scoped>
.all_action {
  display: flex;
  gap: 15px;
}

.add_another {
  border: none;
  padding: 8px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--light_gray_clr);
  border-radius: 50%;
  font-size: 18px;
  color: var(--light_gray_clr);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .fa-trash {
    color: #ff2159;
    cursor: pointer;
  }
}
</style>
