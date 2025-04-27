import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  view: null,
};

const qnaSlice = createSlice({
  initialState,
  name: "question",
  reducers: {
    setQuestions: (state, action) => {
      state.data = action.payload;
    },
    removeQuestion: (state, action) => {
      state.data = state.data.filter((q) => q.id !== action.payload);
    },
    setViewQuestion: (state, action) => {
      state.view = action.payload;
    },
    updateViewQuestion: (state, action) => {
      if (state.view) {
        state.view = { ...state.view, ...action.payload };
      }
    },
    addNewAnswerToQuestion: (state, action) => {
      const answer = action.payload;
      state.view = {
        ...state.view,
        answers: [answer, ...state.view.answers],
      };
    },
    removeAnswer: (state, action) => {
      if (state.view.answers) {
        state.view.answers = state.view.answers.filter(
          (a) => a.id !== action.payload
        );
      }
    },
  },
});

export const {
  setQuestions,
  removeQuestion,
  setViewQuestion,
  updateViewQuestion,
  addNewAnswerToQuestion,
  removeAnswer,
} = qnaSlice.actions;

export default qnaSlice.reducer;
