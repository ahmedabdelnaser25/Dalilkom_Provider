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
              <!-- Start:: order number Input -->
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.order_num')"
                v-model.trim="filterOptions.title"
              />
              <!-- End:: order number Input -->
              <!-- Start:: provider name Input -->
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.provider_name')"
                v-model.trim="filterOptions.title"
              />
              <!-- End:: provider name Input -->
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
          <h5>{{ $t("PLACEHOLDERS.supplier_settlement") }}</h5>
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
        :items-per-page="paginations.items_per_page"
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

        <!-- Start:: Title -->
        <template v-slot:[`item.title`]="{ item }">
          <p class="text-danger" v-if="!item.title">
            {{ $t("TABLES.noData") }}
          </p>
          <p v-else>{{ item.title }}</p>
        </template>
        <!-- End:: Title -->
        <!-- Start:: Title -->
        <template v-slot:[`item.rejection_reason`]="{ item }">
          <p class="text-danger" v-if="!item.rejection_reason">
            {{ $t("TABLES.noData") }}
          </p>
          <p v-else>{{ item.rejection_reason }}</p>
        </template>
        <!-- End:: Title -->

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

            <a-tooltip placement="bottom" v-if="$can('banks edit', 'banks')">
              <template slot="title">
                <span>{{ $t("BUTTONS.accept") }}</span>
              </template>
              <button class="btn_edit" @click="SelectedacceptItem(item)">
                <i class="far fa-check"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom" v-if="$can('banks delete', 'banks')">
              <template slot="title">
                <span>{{ $t("BUTTONS.reject") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="far fa-times"></i>
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
          <!-- start:: accepted dialog -->
          <v-dialog v-model="acceptedDialog">
            <v-card>
              <v-card-title
                class="text-h5 justify-center"
                v-if="itemToAccepted"
              >
                {{
                  $t("TITLES.acceptedOrder", {
                    name: itemToAccepted.name,
                  })
                }}
              </v-card-title>
              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.balance')"
                  v-model.trim="balance"
                  required
                />
              </form>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="acceptItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDelete = false">{{
                  $t("BUTTONS.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end::accepted dialog -->

          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{
                  $t("TITLES.rejectedOrder", {
                    name: itemToDelete.name,
                  })
                }}
              </v-card-title>
              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.rejectedReason')"
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
          name: this.$t("STATUS.new"),
          value: "new",
        },
        {
          id: 1,
          name: this.$t("STATUS.accepted"),
          value: "accepted",
        },
        {
          id: 2,
          name: this.$t("STATUS.canceled"),
          value: "rejected",
        },
      ];
    },
  },

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      // End:: Loading Data
      acceptedDialog: false,
      refusedReason: null,
      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        title: null,
        country_id: null,
        is_active: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.StoresTypes.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.order_num"),
          value: "request_number",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.provider_name"),
          value: "name",
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
          text: this.$t("PLACEHOLDERS.rejectedReason"),
          value: "rejection_reason",
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
      itemToAccepted: null,
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
          path: "/providers-wallets/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.title = null;
      this.filterOptions.is_active = null;
      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/providers-wallets/all",
          query: { page: 1 },
        });
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
          url: "withdraw-requests",
          params: {
            page: this.paginations.current_page,
            name: this.filterOptions.title,
            status: this.filterOptions.is_active?.value,
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

    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");
      try {
        await this.$axios({
          method: "POST",
          url: `banks/status/${item.id}`,
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
      this.$router.push({ path: `/banks/edit/${item.id}` });
    },

    showItem(item) {
      this.$router.push({ path: `/banks/show/${item.id}` });
    },
    // ===== End:: End

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    SelectedacceptItem(item) {
      this.acceptedDialog = true;
      this.itemToAccepted = item;
    },
    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "POST",
          url: `withdraw-requests`,
          data: {
            id: this.itemToDelete.id,
            status: "rejected",
            rejection_reason: this.refusedReason,
          },
        });
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.reject_message"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },

    async acceptItem() {
      try {
        await this.$axios({
          method: "POST",
          url: `withdraw-requests`,
          data: {
            id: this.itemToAccepted.id,
            status: "approved",
            admin_amount: this.balance,
          },
        });
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.reject_message"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Delete

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
  },
};
</script>
