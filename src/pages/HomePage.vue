<template>
  <div class="show_all_content_wrapper">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("SIDENAV.Users.control") }}</h5>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <!-- <ComingSoon /> -->
      <div class="statics mt-4">
        <div class="row">
          <div
            class="col-lg-6 col-md-6 col-12"
            v-for="(value, key) in statics"
            :key="'i' + key"
          >
            <div class="box">
              <div class="icon">
                <i v-if="key === 'Products'" class="fas fa-box"></i>
                <i
                  v-else-if="key === 'Providers'"
                  class="fas fa-people-carry"
                ></i>
                <i v-else-if="key === 'Active_Offers'" class="fas fa-tags"></i>
                <i
                  v-else-if="key === 'InActive_Offers'"
                  class="fas fa-pause-circle"
                ></i>
                <i v-else-if="key === 'All_Offers'" class="fas fa-store"></i>
              </div>
              <div class="info_box">
                <span v-if="key == 'Admins'">{{
                  $t("PLACEHOLDERS.new_requests_count")
                }}</span>
                <span v-else-if="key === 'Products'">{{
                  $t("PLACEHOLDERS.provider_total")
                }}</span>
                <span v-else-if="key === 'InActive_Offers'">{{
                  $t("PLACEHOLDERS.InActive_offers")
                }}</span>
                <span v-else-if="key === 'Active_Offers'">{{
                  $t("PLACEHOLDERS.Active_offers")
                }}</span>
                <span v-else-if="key === 'All_Offers'">{{
                  $t("PLACEHOLDERS.finsihed_stories")
                }}</span>
                <span v-else-if="key === 'canceled_orders'">{{
                  $t("PLACEHOLDERS.canceled_requests_count")
                }}</span>
                <span v-else-if="key === 'rejected_orders'">{{
                  $t("PLACEHOLDERS.rejected_requests_count")
                }}</span>
                <span v-else-if="key === 'active_orders'">{{
                  $t("PLACEHOLDERS.incomplete_requests_count")
                }}</span>
                <p class="number_box">{{ value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->
  </div>
</template>

<script>
import ComingSoon from "@/components/ui/ComingSoon.vue";

export default {
  name: "HomePage",

  components: {
    ComingSoon,
  },

  data() {
    return {
      statics: [],
    };
  },

  methods: {
    async getStatics() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "statistics",
        });

        // console.log("All Data ==>", res.data.data);
        this.statics = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows
  },

  mounted() {
    this.getStatics();
  },
};
</script>

<style lang="scss" scoped>
.show_all_content_wrapper {
  .statics {
    .box {
      background: #34bf6c;
      padding: 25px;
      margin-bottom: 10px;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;

      cursor: pointer;
      transition: all 0.5s;

      &:hover {
        background: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .icon {
          i {
            color: #34bf6c;
          }
        }

        .info_box {
          span,
          p.number_box {
            color: #000;
          }
        }
      }

      .icon {
        height: 60px;
        min-width: 60px;
        width: 60px;
        border-radius: 60px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 25px;
          color: #000;
        }
      }

      .info_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        span {
          font-size: 19px;
          color: #fff;
        }

        p.number_box {
          font-size: 30px;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  /*  .statics {
    .box {
      background: aliceblue;
      padding: 25px;
      margin-bottom: 10px;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;

      cursor: pointer;
      transition: all 0.5s;

      &:hover {
        background: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .icon {
        height: 60px;
        min-width: 60px;
        width: 60px;
        border-radius: 60px;
        background: rgba(0, 123, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 25px
        }
      }

      .info_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        span {
          font-size: 19px;
          color: #6c757d;
        }

        p.number_box {
          font-size: 30px;
          color: #000;
          font-weight: bold;
        }
      }
    }
  } */
}
</style>
