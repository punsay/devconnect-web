import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      if (!state) return state;
      return state.filter((user) => user._id !== action.payload);
    },
    restoreUserToFeed: (state, action) => {
      if (!state) return [action.payload];
      if (state.some((user) => user._id === action.payload._id)) return state;
      return [action.payload, ...state];
    },
    removeFeed: () => null,
  },
});

export const { addFeed, removeUserFromFeed, restoreUserToFeed, removeFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
