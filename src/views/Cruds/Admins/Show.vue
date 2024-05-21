<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showAdmin") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <div class="badges_wrapper justify-content-between d-flex">
        <div class="wrapper" style="display: flex; gap: 12px">
          <v-chip
            color="amber darken-2"
            text-color="white"
            v-model="numberVisits"
          >
            {{ $t("TITLES.numberOfVisits", { number: numberVisits }) }}
          </v-chip>
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.lastVisit", { date: data.lastVisit }) }}
          </v-chip>
        </div>

        <v-chip :color="data.active ? 'green' : 'red'" text-color="white">
          {{ data.active ? $t("STATUS.active") : $t("STATUS.notActive") }}
        </v-chip>
      </div>
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input
            col="12"
            identifier="admin_image"
            :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.personalImage')"
            @selectImage="selectImage"
            disabled
          />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            disabled
          />
          <!-- End:: Name Input -->

          <!-- Start:: Email Input -->
          <base-input
            col="6"
            type="email"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            disabled
          />
          <!-- End:: Email Input -->

          <!-- Start:: Phone Input -->
          <base-input
            col="6"
            type="tel"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.phone"
            disabled
          />
          <!-- End:: Phone Input -->

          <!-- Start:: Roles Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.role')"
            v-model.trim="data.role"
            disabled
          />
          <!-- End:: Roles Input -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "EditAdmin",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

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
        name: null,
        email: null,
        phone: null,
        role: null,
        enableEditPassword: false,
        password: null,
        passwordConfirmation: null,
        active: true,
        lastVisit: null,
        numberVisits: null,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {},

  methods: {
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admins/${this.id}`,
        });
        // console.log( "DATA TO EDIT =>", res.data.data.region );

        // Start:: Set Data
        this.data.image.path = res.data.data.Admin.image;
        this.data.name = res.data.data.Admin.name;
        this.data.email = res.data.data.Admin.email;
        console.log("stt", res.data.data.Admin.login_counter);
        this.numberVisits = res.data.data.Admin.login_counter;

        console.log("num", this.data.numberVisits),
          (this.data.phone = res.data.data.Admin.mobile);
        this.data.role = res.data.data.Admin.roles[0].name;
        this.data.active = res.data.data.Admin.is_active;
        this.data.lastVisit = res.data.data.Admin.last_login_at;
        console.log("first", res.data.data.Admin.login_counter);
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit
  },

  async created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
