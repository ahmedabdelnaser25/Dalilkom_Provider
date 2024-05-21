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
                :placeholder="$t('PLACEHOLDERS.clientName')"
                v-model.trim="filterOptions.title"
              />
              <!-- End:: Name Input -->
              <!-- Start:: orderNumber Input -->
              <base-input
                col="4"
                type="number"
                :placeholder="$t('PLACEHOLDERS.orderNumber')"
                v-model.trim="filterOptions.orderNumber"
              />

              <!-- End:: phone Input -->
              <base-input
                col="4"
                type="number"
                :placeholder="$t('PLACEHOLDERS.phone')"
                v-model.trim="filterOptions.phone"
              />

              <!-- End:: phone Input -->
              <!-- Start:: Status Input -->
              <base-select-input
                col="4"
                :optionsList="activeStatuses"
                :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.active"
              />
              <!-- End:: Status Input -->
              <!-- Start::  Input -->
              <base-select-input
                col="4"
                :placeholder="$t('PLACEHOLDERS.providers')"
                :optionsList="ProvidersList"
                v-model="filterOptions.providers"
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
          <h5>{{ $t("SIDENAV.Orders.title") }}</h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
        </div>

        <div class="title_route_wrapper" v-if="$can('orders create', 'orders')">
          <router-link to="/orders/create">
            {{ $t("SIDENAV.Orders.add") }}
          </router-link>
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
            <h6 v-else>{{ index + 1 }}</h6>
            <!-- Display the index for each row -->
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
        <!-- start providers -->
        <template v-slot:[`item.items.products`]="{ item }">
          <div v-if="hasMultipleProviders(item.items.products)">
            <!-- Display a message or perform actions if there are multiple providers -->
            <!-- <p>متعدد</p> -->
            {{ hasMultipleProviders(item.items.products) }}
          </div>
          <div v-else>
            <!-- Iterate over products -->
            <div v-for="product in item.items.products" :key="product.id">
              <!-- Render product details -->
              <!-- Add more product details as needed -->
            </div>
          </div>

          <!-- <div v-for="product in item.items.products"></div> -->
        </template>
        <!-- end providers -->

        <!-- Start:: Activation -->
        <template v-slot:[`item.total`]="{ item }"
          ><v-chip color="primary">{{ item.total }}</v-chip>
        </template>
        <!-- End:: Activation -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip
              placement="bottom"
              v-if="$can('orders show', 'orders') && item._status == 'new'"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="rejectOrder(item)">
                <span class="text-danger text-h5">
                  <i class="far fa-times"></i>
                </span>
              </button>
            </a-tooltip>
            <!-- approved order -->
            <a-tooltip
              placement="bottom"
              v-if="$can('orders show', 'orders') && item._status == 'paid'"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.accept") }}</span>
              </template>
              <button class="btn_show" @click="approvedOrder(item)">
                <span class="text-danger text-h5">
                  <i class="far fa-check"></i>
                </span>
              </button>
            </a-tooltip>
            <!-- approved order -->

            <a-tooltip placement="bottom" v-if="$can('orders show', 'orders')">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <a-tooltip
              placement="bottom"
              v-if="$can('orders edit', 'orders') && item._status == 'new'"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>
              <button class="btn_edit" @click="acceptedOrders(item)">
                <i class="far fa-check"></i>
              </button>
            </a-tooltip>
            <a-tooltip
              placement="bottom"
              v-if="$can('orders edit', 'orders') && item._status == 'paid'"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.change_status_order") }}</span>
              </template>
              <button class="btn_edit" @click="changePaidSelected(item)">
                <i class="far fa-check"></i>
              </button>
            </a-tooltip>
            <!-- deliverd status -->
            <a-tooltip
              placement="bottom"
              v-if="
                $can('orders edit', 'orders') && item._status == 'on_the_way'
              "
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.change_status_order") }}</span>
              </template>
              <button
                class="btn_edit"
                @click="changePaidSelectedToDelivered(item)"
              >
                <i class="far fa-check"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="confirmOrderItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>
            <!-- 
            <template v-else>
              <i
                class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"
              ></i>
            </template> -->
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
          <!-- start:: change paid item to on the way -->

          <v-dialog v-model="dialogPaid">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToChange">
                {{
                  $t("TITLES.change_paid_status", {
                    name: itemToChange.client.name,
                  })
                }}
              </v-card-title>
              <div
                v-for="product in paidProducts"
                :key="product.id"
                class="d-flex align-center gap-3"
              >
                <input
                  type="radio"
                  v-model="selectedValues"
                  :value="product.id"
                />
                <h5>{{ product.name }}</h5>
              </div>
              <v-card-actions>
                <v-btn
                  class="modal_confirm_btn"
                  @click="changePaidStatus(itemToChange)"
                  >{{ $t("BUTTONS.ok") }}</v-btn
                >

                <v-btn
                  class="modal_cancel_btn"
                  @click="dialogPaid = false"
                  >{{ $t("BUTTONS.cancel") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- end:: change paid item to delivered -->
          <v-dialog v-model="dialogDelivered">
            <v-card>
              <v-card-title
                class="text-h5 justify-center"
                v-if="itemToDelivered"
              >
                {{
                  $t("TITLES.change_To_Delivred", {
                    name: itemToDelivered.client.name,
                  })
                }}
              </v-card-title>
              <div
                v-for="product in paidProducts"
                :key="product.id"
                class="d-flex align-center gap-3"
              >
                <input
                  type="radio"
                  v-model="selectedValues"
                  :value="product.id"
                />
                <h5>{{ product.name }}</h5>
              </div>
              <v-card-actions>
                <v-btn
                  class="modal_confirm_btn"
                  @click="changePaidStatusToDelivered(itemToChange)"
                  >{{ $t("BUTTONS.ok") }}</v-btn
                >

                <v-btn
                  class="modal_cancel_btn"
                  @click="dialogDelivered = false"
                  >{{ $t("BUTTONS.cancel") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- end:: change paid item to delivered -->
          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{
                  $t("TITLES.rejectedOrder", {
                    name: itemToDelete.client.name,
                  })
                }}
              </v-card-title>

              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.rejectedReason')"
                  v-model.trim="rejectedReason"
                  required
                />
              </form>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmRejectItem">{{
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
import { mapGetters } from "vuex";

export default {
  name: "AllStores",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),

    activeStatuses() {
      return [
        {
          id: 0,
          name: this.$t("ORDERS.new"),
          value: "new",
        },
        {
          id: 1,
          name: this.$t("ORDERS.accepted"),
          value: "accepted",
        },
        {
          id: 2,
          name: this.$t("ORDERS.approved"),
          value: "approved",
        },
        {
          id: 3,
          name: this.$t("ORDERS.paid"),
          value: "paid",
        },
        {
          id: 4,
          name: this.$t("ORDERS.on_the_way"),
          value: "on_the_way",
        },
        {
          id: 5,
          name: this.$t("ORDERS.delivered_awaiting_confirmation"),
          value: "delivered_awaiting_confirmation",
        },
        {
          id: 6,
          name: this.$t("ORDERS.delivered_awaiting_confirmation"),
          value: "delivered_awaiting_confirmation",
        },
        {
          id: 7,
          name: this.$t("ORDERS.delivered"),
          value: "delivered",
        },
        {
          id: 8,
          name: this.$t("ORDERS.finsished"),
          value: "finsished",
        },
        {
          id: 9,
          name: this.$t("ORDERS.canceled"),
          value: "canceled",
        },
        {
          id: 10,
          name: this.$t("ORDERS.rejected"),
          value: "rejected",
        },
        {
          id: 11,
          name: this.$t("ORDERS.awaiting_payment"),
          value: "awaiting_payment",
        },
        {
          id: 12,
          name: this.$t("ORDERS.pending"),
          value: "pending",
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
      addOrder: false,
      // Start:: Filter Data
      products: [],
      rejectedReason: null,
      filterFormIsActive: false,
      filterOptions: {
        title: null,
        active: null,
        orderNumber: null,
        providers: null,
        phone: null,
      },
      // End:: Filter Data
      ProvidersList: [],
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
          text: this.$t("TABLES.StoresTypes.name"),
          value: "client.name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Orders.orderNumber"),
          value: "order_number",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Users.phone"),
          value: "client.mobile",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.status"),
          value: "status",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Orders.OrderPrice"),
          value: "total",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Orders.Provider"),
          value: "items.products",
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
          text: this.$t("TABLES.StoresTypes.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data
      paidProducts: [],
      dialogPaid: false,

      // Start:: Dialogs Control Data
      dialogImage: false,
      selectedItemImage: null,
      dialogDescription: false,
      selectedDescriptionTextToShow: "",
      dialogDelete: false,
      itemToDelete: null,
      dialogPaid: false,
      itemToChange: null,
      dialogDelivered: false,
      itemToDelivered: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      // Start:: Page Permissions
      permissions: null,
      // Start:: Page Permissions
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
  computed: {},
  methods: {
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== "1") {
        await this.$router.push({ path: "/orders/all", query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.title = null;
      this.filterOptions.phone = null;
      this.filterOptions.active = null;
      if (this.$route.query.page !== "1") {
        await this.$router.push({ path: "/orders/all", query: { page: 1 } });
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
          url: "orders",
          params: {
            page: this.paginations.current_page,
            clientName: this.filterOptions.title,
            status: this.filterOptions.active?.value,
            receiverMobile: this.filterOptions.phone,
            orderNumber: this.filterOptions.orderNumber,
            provider: this.filterOptions.providers,
          },
        });

        this.loading = false;
        this.tableRows = res.data.data;
        this.products = res.data.data;
        console.log("####products###", this.products);
        if (res.data.data.length == 0) {
          this.addOrder = true;
        }
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    showDescriptionModal(description) {
      this.dialogDescription = true;
      this.selectedDescriptionTextToShow = description;
    },
    // End:: Control Modals

    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      try {
        await this.$axios({
          method: "GET",
          url: `orders/status/${item.id}`,
        });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    getPaidProducts(items) {
      this.paidProducts = items.items.products.map((item) => {
        return {
          id: item.id,
          name: item.item.name,
        };
      });
      console.log(this.paidProducts);
    },
    // End:: Change Activation Status
    // Start:: Change paid status
    async changePaidStatus(items) {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");

      console.log(
        "changePaidStatus",
        items.items.products.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      );
      try {
        await this.$axios({
          method: "POST",
          url: `orders/${this.selectedValues}/change-status-to-on-the-way`,
          data: REQUEST_DATA,
        });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change paid Status
    // Start:: Change paid status To Delivered
    async changePaidStatusToDelivered(items) {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "PUT");

      try {
        await this.$axios({
          method: "POST",
          url: `orders/${this.selectedValues}/change-status-to-delivered`,
          data: REQUEST_DATA,
        });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change paid Status
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
    // start::get clients
    async getClients(item) {
      try {
        const res = await this.$axios({
          method: "GET",
          url: `/clients`,
        });
        // this.ProvidersList = res.data.data;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // end:: get clients
    // ==================== Start:: Crud ====================
    // ===== Start:: End
    acceptedOrders(item) {
      this.$router.push({ path: `/orders/accepted-orders/${item.id}` });
    },

    showItem(item) {
      this.$router.push({ path: `/orders/show/${item.id}` });
    },
    // ===== End:: End
    hasMultipleProviders(products) {
      const providerIds = products.map(
        (product) =>
          product.provider?.name ?? this.$t("SIDENAV.Orders.management")
      );
      const uniqueProviderNames = [...new Set(providerIds)];

      // If the length of uniqueProviderNames is greater than 1, it means there are multiple providers
      return uniqueProviderNames;
      // console.log(providerIds);
    },
    containsNull(array) {
      return array.some((element) => element === null);
    },

    // ===== Start:: Delete
    rejectOrder(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    changePaidSelected(item) {
      this.dialogPaid = true;
      this.itemToChange = item;
      this.getPaidProducts(item);
    },
    changePaidSelectedToDelivered(item) {
      this.dialogDelivered = true;
      this.itemToDelivered = item;
      this.getPaidProducts(item);
    },
    // start confirm orders
    async confirmOrderItem(item) {
      try {
        await this.$axios({
          method: "POST",
          url: `orders/approve/${item.id}`,
        });
        // this.dialogDelete = false;
        // this.tableRows = this.tableRows.filter((item) => {
        //   return item.id != this.itemToDelete.id;
        // });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        // this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: confirm orders
    // start::reject order
    async confirmRejectItem() {
      try {
        await this.$axios({
          method: "POST",
          url: `orders/accept-reject/${this.itemToDelete.id}`,
          data: {
            rejection_reason: this.rejectedReason,
            status: "rejected",
          },
        });
        this.dialogDelete = false;
        console.log("item to delete", this.itemToDelete);
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // end:: reject order
    // approved order
    async approvedOrder(item) {
      try {
        await this.$axios({
          method: "POST",
          url: `orders/approve/${item.id}`,
        });
        this.dialogDelete = false;
        console.log("item to delete", this.itemToDelete);
        this.setTableRows();
        this.$message.success(this.$t("BUTTONS.approved"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // approved order

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
    this.getProviders();
    this.getClients();

    // End:: Fire Methods
  },
};
</script>
<style scoped>
.text-danger {
  color: red !important;
}
</style>
