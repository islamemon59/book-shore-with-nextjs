import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  cartCount: number;
  unreadNotifications: number;
};

const initialState: UIState = {
  cartCount: 0,
  unreadNotifications: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
    setUnreadNotifications: (state, action: PayloadAction<number>) => {
      state.unreadNotifications = action.payload;
    },
  },
});

export const { setCartCount, setUnreadNotifications } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
