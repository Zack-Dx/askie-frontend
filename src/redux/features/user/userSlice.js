import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.data = null;
    },
    updateUser: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    subscribeNewsLetter: (state) => {
      state.data.isNewsSub = true;
    },
    unSubscribeNewsLetter: (state) => {
      state.data.isNewsSub = false;
    },
    makeUserPremium: (state) => {
      state.data.isPremium = true;
    },
    askieFreeQuotaUsed: (state) => {
      state.data.freeAskieQuota = state.data.freeAskieQuota - 1;
    },
    askiePremiumQuotaUsed: (state) => {
      state.data.premiumAskieQuota = state.data.premiumAskieQuota - 1;
    },
  },
});

export const {
  setUser,
  clearUser,
  updateUser,
  subscribeNewsLetter,
  unSubscribeNewsLetter,
  makeUserPremium,
  askieFreeQuotaUsed,
  askiePremiumQuotaUsed,
} = userSlice.actions;
export default userSlice.reducer;
