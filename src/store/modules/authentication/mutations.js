export default {
  // Start:: Set Authenticated User Data
  setAuthenticatedUserData(state, payload) {
    if (payload.id) {
      state.userId = payload.id;
      localStorage.setItem("dalilkum_provider_dashboard_user_id", payload.id);
    }
    if (payload.token) {
      state.userToken = payload.token;
      localStorage.setItem("dalilkum_provider_dashboard_user_token", payload.token);
    }
    if (payload.type) {
      state.userType = payload.type;
      localStorage.setItem("dalilkum_provider_dashboard_user_type", payload.type);
    }
    if (payload.name) {
      state.userName = payload.name;
      localStorage.setItem("dalilkum_provider_dashboard_userName", payload.name);
    }
    if (payload.email) {
      state.email = payload.email;
      localStorage.setItem("dalilkum_provider_dashboard_email", payload.email);
    }
    if (payload.avatar) {
      state.userAvatar = payload.avatar;
      localStorage.setItem(
        "dalilkum_provider_dashboard_user_avatar",
        payload.avatar
      );
    }
    if (payload.ability) {
      state.ability = payload.ability;
      localStorage.setItem(
        "dalilkum_provider_dashboard_user_ability",
        payload.ability
      );
    }
  },
  // End:: Set Authenticated User Data
};
