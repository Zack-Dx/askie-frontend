import { CONFIG } from "@/constants";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAnswerToQuestion,
  removeAnswer,
  setViewQuestion,
} from "@/redux/features/qna/qnaSlice";

const useAnswers = () => {
  const dispatch = useDispatch();
  const viewQuestion = useSelector((store) => store.questions.view);
  const [isCreatingAnswerLoading, setIsCreatingAnswerLoading] = useState(false);
  const [deletingAnswerId, setDeletingAnswerId] = useState(null);
  const [deleteAnswerLoading, setDeleteAnswerLoading] = useState(false);
  const [updateAnswerLoading, setUpdateAnswerLoading] = useState(false);

  const postNewAnswer = async (content, questionId) => {
    setIsCreatingAnswerLoading(true);
    try {
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/questions/${questionId}/answers`,
        content,
        {
          withCredentials: true,
        }
      );

      const { data, message } = response.data;
      toast.success(message);
      dispatch(addNewAnswerToQuestion(data));
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsCreatingAnswerLoading(false);
    }
  };

  const handleAnswerVoting = async (value, answerId) => {
    try {
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/votes/answer/${answerId}`,
        { value },
        {
          withCredentials: true,
        }
      );

      const { message, data } = response.data;

      const updatedAnswers = viewQuestion?.answers?.map((answer) => {
        if (answer.id === answerId) {
          return { ...answer, votes: data.votes, selfVote: data.selfVote };
        }
        return answer;
      });

      dispatch(setViewQuestion({ ...viewQuestion, answers: updatedAnswers }));
      toast.success(message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const deleteAnswer = async (answerId) => {
    try {
      setDeleteAnswerLoading(true);
      setDeletingAnswerId(answerId);

      const response = await axios.delete(
        `${CONFIG.BACKEND_API_URL}/answers/${answerId}`,
        {
          withCredentials: true,
        }
      );

      dispatch(removeAnswer(answerId));
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setDeleteAnswerLoading(false);
      setDeletingAnswerId(null);
    }
  };

  const updateAnswer = async (answerId, updatedAnswerData) => {
    setUpdateAnswerLoading(true);
    try {
      const response = await axios.patch(
        `${CONFIG.BACKEND_API_URL}/answers/${answerId}`,
        updatedAnswerData,
        {
          withCredentials: true,
        }
      );

      const { message, data } = response.data;
      const updatedAnswers = viewQuestion?.answers?.map((answer) =>
        answer.id === answerId
          ? {
              ...answer,
              title: data.title,
              content: data.content,
              factScore: data.factScore,
            }
          : answer
      );
      toast.success(message);
      dispatch(setViewQuestion({ ...viewQuestion, answers: updatedAnswers }));
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdateAnswerLoading(false);
    }
  };

  return {
    postNewAnswer,
    handleAnswerVoting,
    deleteAnswer,
    updateAnswer,
    isCreatingAnswerLoading,
    deleteAnswerLoading,
    deletingAnswerId,
    updateAnswerLoading,
  };
};

export default useAnswers;
