<template>
  <div class="show_all_content_wrapper">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div
        class="filter_content_wrapper"
        :class="{ active: filterFormIsActive }"
      >
        <button
          class="filter_toggler"
          @click="filterFormIsActive = !filterFormIsActive"
        >
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>

        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <!-- Start::Product Name Input -->
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.product_name')"
                v-model.trim="filterOptions.title"
              />
              <!-- End::Product Name Input -->
              <!-- start category -->
              <base-select-input
                col="4"
                :optionsList="mainCategory"
                :placeholder="$t('PLACEHOLDERS.main_category')"
                v-model="filterOptions.mainCategory"
                @input="getSubCategories"
              />
              <!-- end category -->
              <!-- start sub category -->
              <base-select-input
                col="4"
                :optionsList="subCategory"
                :placeholder="$t('PLACEHOLDERS.sub_category')"
                v-model="filterOptions.subCategory"
                @input="getProducts"
              />
              <!-- end sub category -->
              <!-- start::measure -->
              <base-select-input
                col="4"
                :optionsList="measuresData"
                :placeholder="$t('PLACEHOLDERS.measures')"
                v-model="filterOptions.measures"
              />
              <!-- end::measure -->
              <!-- start::providers -->
              <base-select-input
                col="4"
                :optionsList="ProvidersList"
                :placeholder="$t('PLACEHOLDERS.providers')"
                v-model="filterOptions.provider"
              />
              <!-- end::providers -->
              <!-- Start:: Status Input -->
              <base-select-input
                col="4"
                :optionsList="activeStatuses"
                :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.is_active"
              />
              <!-- End:: Status Input -->
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button
                class="reset_btn"
                type="button"
                :disabled="isWaitingRequest"
                @click="resetFilter"
              >
                <i class="fal fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("PLACEHOLDERS.products") }}</h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
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
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <!-- Start:: Item Image -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="!item.id">
              {{ $t("TABLES.noData") }}
            </h6>
            <p v-else>
              {{
                (paginations.current_page - 1) * paginations.items_per_page +
                index +
                1
              }}
            </p>
          </div>
        </template>
        <!-- End:: Item Image -->
        <!-- Start:: Item Image -->
        <template v-slot:[`item.owner.name`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 v-if="!item.owner?.name">
              {{ $t("PLACEHOLDERS.management") }}
            </h6>
            <p v-else>
              {{ item.owner?.name }}
            </p>
          </div>
        </template>
        <!-- End:: Item Image -->

        <!-- Start:: Title -->
        <template v-slot:[`item.title`]="{ item }">
          <p class="text-danger" v-if="!item.title">
            {{ $t("TABLES.noData") }}
          </p>
          <p v-else>{{ item.title }}</p>
        </template>
        <!-- End:: Title -->
        <!-- start:: price  -->
        <!-- <template v-slot:[`item.price_after_commission`]="{ item }">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{ $t("BUTTONS.edit") }}</span>
            </template>
            <button class="btn_edit" @click="goToPorvidersPrices(item)">
              <i class="fal fa-edit"></i>
            </button>
          </a-tooltip>
        </template> -->
        <!-- end:: price -->

        <!-- Start:: Activation -->
        <template v-slot:[`item.is_active`]="{ item }">
          <!-- v-if="permissions.activate" -->
          <!-- <div
            class="activation"
            dir="ltr"
            style="z-index: 1"
            v-if="$can('products activate', 'products')"
          >
            <v-switch
              class="mt-2"
              color="success"
              v-model="item.is_active"
              hide-details
              @change="changeActivationStatus(item)"
            ></v-switch>
          </div> -->
        </template>
        <!-- End:: Activation -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <!-- <a-tooltip placement="bottom" v-if="$can('banks show', 'banks')">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip> -->
            <a-tooltip
              placement="bottom"
              v-if="$can('products edit', 'products')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.reject") }}</span>
              </template>
              <button class="btn_deactivate" @click="selectDeleteItem(item)">
                <i class="fad fa-times-circle"></i>
              </button>
            </a-tooltip>
            <a-tooltip
              placement="bottom"
              v-if="$can('products edit', 'products')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.accept") }}</span>
              </template>
              <button @click="approvedProviders(item)">
                <i
                  class="fad fa-check-square fa-lg"
                  style="
                    --fa-primary-color: #4f6e50;
                    --fa-secondary-color: #4f6e50;
                  "
                ></i>
              </button>
            </a-tooltip>

            <template v-else>
              <i
                class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"
              ></i>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Image Modal -->
          <image-modal
            v-if="dialogImage"
            :modalIsOpen="dialogImage"
            :modalImage="selectedItemImage"
            @toggleModal="dialogImage = !dialogImage"
          />
          <!-- End:: Image Modal -->

          <!-- Start:: Description Modal -->
          <description-modal
            v-if="dialogDescription"
            :modalIsOpen="dialogDescription"
            :modalDesc="selectedDescriptionTextToShow"
            @toggleModal="dialogDescription = !dialogDescription"
          />
          <!-- End:: Description Modal -->

          <!-- Start:: refused product offer Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{
                  $t("TITLES.Refusedproduct", {
                    name: itemToDelete.product_name,
                  })
                }}
              </v-card-title>
              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.refused_reason')"
                  v-model.trim="refusedReason"
                  required
                />
              </form>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmDeleteItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDelete = false">{{
                  $t("BUTTONS.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: refused product offer Modal -->

          <!-- End:: Delete Modal -->
        </template>
        <!-- ======================== End:: Dialogs ======================== -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination
          class="py-0"
          square
          v-model="paginations.current_page"
          :length="paginations.last_page"
          :total-visible="6"
          @input="updateRouterQueryParam($event)"
          :prev-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
          "
          :next-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
          "
        />
      </div>
    </template>
    <!-- End:: Pagination -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AllRegions",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
      getCountriesData: "ApiGetsModule/allCountriesData",
    }),

    activeStatuses() {
      return [
        {
          id: null,
          name: this.$t("STATUS.all"),
          value: null,
        },
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

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      refusedReason: "",
      // End:: Loading Data
      ProvidersList: [],
      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        title: null,
        is_active: null,
        mainCategory: "",
        subCategory: "",
        measures: "",
        provider: null,
      },
      // End:: Filter Data
      // start:  categories data
      mainCategory: [],
      subCategory: [],
      // end: categorioes data
      // start::measures
      measuresData: [],
      // end::measures
      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.StoresTypes.serialNumber"),
          value: "id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.product_name"),
          value: "product_name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.main_category"),
          value: "category_name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.sub_category"),
          value: "sub_category_name",
          sortable: false,
          align: "center",
        },
        // {
        //   text: this.$t("PLACEHOLDERS.weight"),
        //   value: "sub_category_name",
        //   sortable: false,
        //   align: "center",
        // },
        {
          text: this.$t("PLACEHOLDERS.product_creator"),
          value: "provider.name",
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
          text: this.$t("TABLES.Products.created_at"),
          value: "created_at",
          sortable: false,
          align: "center",
        },

        {
          text: this.$t("PLACEHOLDERS.status"),
          value: "status",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("TABLES.StoresTypes.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogImage: false,
      selectedItemImage: null,
      dialogDescription: false,
      selectedDescriptionTextToShow: "",
      dialogDelete: false,
      itemToDelete: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data
    };
  },

  watch: {
    // Start:: Page Query Param Watcher To Get Page Data Based On It's Change
    ["$route.query.page"]() {
      this.paginations.current_page = +this.$route.query.page;
      this.setTableRows();
    },
    // End:: Page Query Param Watcher To Get Page Data Based On It's Change
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getCountries: "ApiGetsModule/getCountries",
    }),
    // End:: Vuex Actions

    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/products-requests/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.title = null;
      this.filterOptions.is_active = null;
      this.filterOptions.mainCategory = null;
      this.filterOptions.subCategory = null;
      this.filterOptions.measures = null;
      this.filterOptions.provider = null;
      if (this.$route.query.page !== "1") {
        await this.$router.push({ path: "/products/all", query: { page: 1 } });
      }
      this.setTableRows();
    },
    // End:: Handel Filter

    // Start:: Set Table Rows
    updateRouterQueryParam(pagenationValue) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pagenationValue,
        },
      });

      // Scroll To Screen's Top After Get Products
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    async setTableRows() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "product-offers",
          params: {
            page: this.paginations.current_page,
            name: this.filterOptions?.title,
            isActive: this.filterOptions?.is_active?.value,
            weight: this.filterOptions?.measures?.id,
            category: this.filterOptions?.mainCategory?.id,
            subCategory: this.filterOptions?.subCategory?.id,
            owner: this.filterOptions?.provider?.id,
          },
        });
        this.loading = false;
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows
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
            category: `${
              this.filterOptions.mainCategory
                ? this.filterOptions.mainCategory.id
                : ""
            }`,
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
    async getMeasures() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/weights?page=0&limit=0`,
        });
        // console.log("Cities =>", res.data.data);
        this.measuresData = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end products
    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");
      try {
        await this.$axios({
          method: "POST",
          url: `products/status/${item.id}`,
          data: REQUEST_DATA,
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change Activation Status

    // ==================== Start:: Crud ====================
    // ===== Start:: End
    editItem(item) {
      this.$router.push({ path: `/products/edit/${item.id}` });
    },

    showItem(item) {
      this.$router.push({ path: `/products-requests/show/${item.id}` });
    },
    goToPorvidersPrices(item) {
      this.$router.push({ path: `/products/providers-prices/${item.id}` });
    },
    // ===== End:: End
    // Start:: get providers
    async getProviders(item) {
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

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },

    async confirmDeleteItem() {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");
      REQUEST_DATA.append("status", "rejected");
      REQUEST_DATA.append("reason", this.refusedReason);
      try {
        await this.$axios.post(
          `product-offers/${this.itemToDelete?.id}`,
          REQUEST_DATA
        );
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // start accepted  provider request
    async approvedProviders(item) {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");
      REQUEST_DATA.append("status", "approved");
      try {
        await this.$axios({
          method: "POST",
          url: `product-offers/${item.id}`,
          data: REQUEST_DATA,
        });
        this.setTableRows();

        this.$message.success(this.$t("MESSAGES.accept_join_request"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // end accepted provider request
    // ==================== End:: Crud ====================
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setTableRows();
    // End:: Fire Methods
    this.getMainCategories();
    this.getSubCategories();
    this.getMeasures();
    this.getProviders();
  },
};
</script>
