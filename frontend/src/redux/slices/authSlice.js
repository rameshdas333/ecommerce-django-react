import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      const { user, access, refresh } = action.payload;

      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;