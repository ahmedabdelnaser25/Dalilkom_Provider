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
              <!-- Start:: Name Input -->
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.name')"
                v-model.trim="filterOptions.title"
              />
              <!-- End:: Name Input -->
              <!-- Start:: phone Input -->
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.phone')"
                v-model.trim="filterOptions.phone"
              />
              <!-- End:: phone Input -->
              <!-- Start:: phone Input -->
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.email')"
                v-model.trim="filterOptions.email"
              />
              <!-- End:: phone Input -->
              <!-- Start:: storeName Input -->
              <base-select-input
                :optionsList="storesName"
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.store_name')"
                v-model.trim="filterOptions.storesName"
              />
              <!-- End:: storeName Input -->
              <!-- Start:: Filters Input -->
              <base-select-input
                col="6"
                :optionsList="activeStatuses"
                :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.is_active"
              />
              <!-- End:: Filters Input -->
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
          <h5>{{ $t("PLACEHOLDERS.accepted-providers") }}</h5>
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
        <!-- Start:: Activation Status -->
        <template v-slot:[`item.is_active`]="{ item }">
          <span class="text-success text-h5" v-if="item.is_active">
            <i class="far fa-check"></i>
          </span>
          <span class="text-danger text-h5" v-else>
            <i class="far fa-times"></i>
          </span>
        </template>
        <!-- End:: Activation Status -->
        <!-- Start:: Title -->
        <template v-slot:[`item.title`]="{ item }">
          <p class="text-danger" v-if="!item.title">
            {{ $t("TABLES.noData") }}
          </p>
          <p v-else>{{ item.title }}</p>
        </template>
        <!-- End:: Title -->

        <!-- Start:: Activation -->
        <template v-slot:[`item.is_active`]="{ item }">
          <span class="text-success text-h5" v-if="item.is_active">
            <i class="far fa-check"></i>
          </span>
          <span class="text-danger text-h5" v-else>
            <i class="far fa-times"></i>
          </span>
        </template>
        <!-- End:: Activation -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip
              placement="bottom"
              v-if="$can('providers show', 'providers')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>
            <a-tooltip
              placement="bottom"
              v-if="$can('providers show', 'providers')"
            >
              <template slot="title">
                <span>{{ $t("PLACEHOLDERS.products") }}</span>
              </template>
              <button class="btn_show" @click="showProducts(item)">
                <i class="fab fa-product-hunt"></i>
              </button>
            </a-tooltip>

            <a-tooltip
              placement="bottom"
              v-if="$can('providers delete', 'providers')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>
            <!-- <a-tooltip
              placement="bottom"
              v-if="$can('providers delete', 'providers')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.wallet") }}</span>
              </template>
              <button class="btn_edit" @click="selectWalletItem(item)">
                <i class="fad fa-wallet"></i>
              </button>
            </a-tooltip> -->
            <template
              v-if="$can('providers activate', 'providers') && item.id !== 1"
            >
              <a-tooltip placement="bottom" v-if="!item.is_active">
                <template slot="title">
                  <span>{{ $t("BUTTONS.activate") }}</span>
                </template>
                <button
                  class="btn_activate"
                  @click="HandlingItemActivationStatus(item)"
                >
                  <i class="fad fa-check-circle"></i>
                </button>
              </a-tooltip>
              <a-tooltip placement="bottom" v-if="item.is_active">
                <template slot="title">
                  <span>{{ $t("BUTTONS.deactivate") }}</span>
                </template>
                <button
                  class="btn_deactivate"
                  @click="selectDeactivateItem(item)"
                >
                  <i class="fad fa-times-circle"></i>
                </button>
              </a-tooltip>
            </template>
            <!-- Start:: Activation Status -->

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

          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{
                  $t("TITLES.Deleted", {
                    name: itemToDelete.name,
                  })
                }}
              </v-card-title>
              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.deleted')"
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
          <!-- Start:: wallet Modal -->
          <v-dialog v-model="dialogWallet">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToWallet">
                {{
                  $t("TITLES.wallets", {
                    name: itemToWallet.name,
                  })
                }}
              </v-card-title>
              <v-card-title>
                {{ $t("current_balance") }}:
                {{ data.currentBalance || 0 }}
              </v-card-title>
              <form class="w-100">
                <base-input
                  col="12"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.balance')"
                  v-model.trim="data.balance"
                  required
                />
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.notes')"
                  v-model.trim="data.walletNotes"
                  required
                />
              </form>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="editwalletItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogWallet = false">{{
                  $t("BUTTONS.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Wallet Modal -->
          <!-- Start:: Deactivate Modal -->
          <v-dialog v-model="dialogDeactivate">
            <v-card>
              <v-card-title
                class="text-h5 justify-center"
                v-if="itemToChangeActivationStatus"
              >
                {{
                  $t("TITLES.DeactivateConfirmingMessage", {
                    name: itemToChangeActivationStatus.name,
                  })
                }}
              </v-card-title>

              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.deactivateReason')"
                  v-model.trim="deactivateReason"
                  required
                />
              </form>

              <v-card-actions>
                <v-btn
                  class="modal_confirm_btn"
                  @click="HandlingItemActivationStatus"
                  :disabled="!!!deactivateReason"
                >
                  {{ $t("BUTTONS.ok") }}
                </v-btn>

                <v-btn
                  class="modal_cancel_btn"
                  @click="dialogDeactivate = false"
                  >{{ $t("BUTTONS.cancel") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Deactivate Modal -->
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
          id: 0,
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
      // End:: Loading Data
      refusedReason: null,
      itemToChangeActivationStatus: null,
      dialogWallet: null,
      storesName: [],
      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        title: null,
        email: null,
        phone: null,
        storesName: null,
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
          text: this.$t("PLACEHOLDERS.name"),
          value: "name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.store_name"),
          value: "store.name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.phone"),
          value: "mobile",
          sortable: false,
          align: "center",
        },

        {
          text: this.$t("PLACEHOLDERS.email"),
          value: "email",
          align: "center",
          sortable: false,
        },

        {
          text: this.$t("TABLES.Products.created_at"),
          value: "created_at",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.status"),
          value: "is_active",
          align: "center",
          sortable: false,
          width: "120",
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
      dialogWallet: false,
      itemToDelete: null,
      itemToWallet: null,
      dialogDeactivate: false,
      deactivateReason: null,
      data: {
        balance: null,
        walletNotes: null,
        oldBalance: null,
        currentBalance: null,
      },

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
    async resetFilter() {
      this.filterOptions.title = null;
      this.filterOptions.phone = null;
      this.filterOptions.email = null;
      this.filterOptions.companyName = null;
      this.filterOptions.storesName = null;
      this.filterOptions.is_active = null;
      if (this.$route.query.page !== "1") {
        await this.$router.push({ path: "/providers/all", query: { page: 1 } });
      }
      this.setTableRows();
    },
    // End:: Vuex Actions
    selectDeactivateItem(item) {
      this.dialogDeactivate = true;
      this.itemToChangeActivationStatus = item;
    },
    async HandlingItemActivationStatus(selectedItem) {
      this.dialogDeactivate = false;
      let targetItem = this.itemToChangeActivationStatus
        ? this.itemToChangeActivationStatus
        : selectedItem;
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("reason", this.deactivateReason);
      // Start:: Append Request Data
      REQUEST_DATA.append("_method", "PUT");

      try {
        await this.$axios({
          method: "POST",
          url: `providers/status/${targetItem.id}`,
          data: REQUEST_DATA,
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
        let filteredElemet = this.tableRows.find(
          (element) => element.id === targetItem.id
        );
        filteredElemet.is_active = !filteredElemet.is_active;

        this.itemToChangeActivationStatus = null;
        this.deactivateReason = null;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/providers/all",
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
          url: "providers",
          params: {
            page: this.paginations.current_page,
            name: this.filterOptions?.title,
            store: this.filterOptions.storesName?.id,
            mobile: this.filterOptions?.phone,
            email: this.filterOptions?.email,
            isActive: this.filterOptions?.is_active?.id,
            company: this.filterOptions?.companyName,
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

    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "DELETE",
          url: `providers/${this.itemToDelete.id}`,
        });
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");
      try {
        await this.$axios({
          method: "POST",
          url: `providers/status/${item.id}`,
          data: REQUEST_DATA,
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change Activation Status
    // start main category
    async getStores() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/stores?page=0&limit=0&isActive=1`,
        });
        // console.log("Cities =>", res.data.data);
        this.storesName = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // end main category
    // ==================== Start:: Crud ====================
    // ===== Start:: End
    editItem(item) {
      this.$router.push({ path: `/providers/edit/${item.id}` });
    },

    showItem(item) {
      this.$router.push({ path: `/providers/show/${item.id}` });
    },
    showProducts(item) {
      this.$router.push({ path: `/providers/products/${item.id}` });
    },
    // ===== End:: End

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },

    // ===== End:: Delete
    // start wallet item
    async selectWalletItem(item) {
      this.dialogWallet = true;
      this.itemToWallet = item;
      try {
        const res = await this.$axios({
          method: "GET",
          url: `providers/balance/${this.itemToWallet.id}`,
        });
        // this.data.balance = res.data.data.balance;
        this.data.oldBalance = res.data.data.balance;
        this.data.currentBalance = res.data.data.balance;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    async editwalletItem() {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");

      // REQUEST_DATA.append("type", "deposit");
      REQUEST_DATA.append("reason", this.data.walletNotes);
      REQUEST_DATA.append("amount", this.data.balance);
      if (this.data.oldBalance < this.data.currentBalance) {
        REQUEST_DATA.append("type", "deposit");
      } else {
        REQUEST_DATA.append("type", "withdrawal");
      }
      // console.log("first", this.data.oldBalance);
      // console.log("second", this.data.balance);

      try {
        await this.$axios({
          method: "POST",
          url: `providers/balance/${this.itemToWallet.id}`,
          data: REQUEST_DATA,
        });
        this.dialogWallet = false;
        this.data.balance = "";
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.updatedBalance"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // end wallet item

    // ==================== End:: Crud ====================
  },

  created() {
    // Start:: Fire Methods
    this.getStores();
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setTableRows();
    // this.selectWalletItem();

    // End:: Fire Methods
  },
};
</script>
