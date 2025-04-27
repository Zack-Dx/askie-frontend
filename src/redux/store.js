import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice.js";
import qnaSlice from "./features/qna/qnaSlice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    questions: qnaSlice,
  },
});

export default store;
