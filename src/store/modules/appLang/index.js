import AppLangActions from "./actions.js";
import AppLangGetters from "./getters.js";
import AppLangMutations from "./mutations";

export default {
  namespaced: true,
  state: {
    // START:: LANGUAGE DATA
    dalilkum_provider_dashboard_language: localStorage.getItem(
      "dalilkum_provider_dashboard_language"
    ),
    // END:: LANGUAGE DATA
  },
  mutations: AppLangMutations,
  actions: AppLangActions,
  getters: AppLangGetters,
};
