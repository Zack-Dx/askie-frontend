import { CONFIG } from "@/constants";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import useAuthentication from "./useAuthentication";
import { useSelector } from "react-redux";
import { removeQuestion, setQuestions } from "@/redux/features/qna/qnaSlice";
import { useDispatch } from "react-redux";

const useQuestions = () => {
  const questions = useSelector((store) => store.questions.data);
  const dispatch = useDispatch();
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [postLoadingQuestion, setPostLoadingQuestion] = useState(false);
  const [updateQuestionLoading, setUpdateQuestionLoading] = useState(false);
  const [deleteQuestionLoading, setDeleteQuestionLoading] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);
  const [fetchQuestionsError, setFetchQuestionsError] = useState(null);

  const selfPostedQuestions = questions.filter(
    (question) => question.userId === user.id
  );

  const fetchAllQuestions = async () => {
    setLoading(true);
    setFetchQuestionsError(null);

    try {
      const response = await axios.get(`${CONFIG.BACKEND_API_URL}/questions`, {
        withCredentials: true,
      });
      const questions = response.data.data;
      dispatch(setQuestions(questions));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setFetchQuestionsError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const postQuestion = async (values) => {
    setPostLoadingQuestion(true);
    try {
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/questions`,
        values,
        {
          withCredentials: true,
        }
      );
      const { data, message } = response.data;
      dispatch(setQuestions([data, ...questions]));
      toast.success(message);
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return false;
    } finally {
      setPostLoadingQuestion(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      setDeleteQuestionLoading(true);
      setDeletingQuestionId(questionId);

      const response = await axios.delete(
        `${CONFIG.BACKEND_API_URL}/questions/${questionId}`,
        {
          withCredentials: true,
        }
      );

      dispatch(removeQuestion(questionId));
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setDeleteQuestionLoading(false);
      setDeletingQuestionId(null);
    }
  };

  const updateQuestion = async (questionId, updatedQuestionData) => {
    setUpdateQuestionLoading(true);
    try {
      const response = await axios.patch(
        `${CONFIG.BACKEND_API_URL}/questions/${questionId}`,
        updatedQuestionData,
        {
          withCredentials: true,
        }
      );

      const { message, data } = response.data;
      const updatedQuestions = questions.map((question) =>
        question.id === questionId
          ? { ...question, title: data.title, content: data.content }
          : question
      );
      toast.success(message);
      dispatch(setQuestions(updatedQuestions));
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdateQuestionLoading(false);
    }
  };

  const handleQuestionVoting = async (value, questionId) => {
    try {
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/votes/question/${questionId}`,
        { value },
        {
          withCredentials: true,
        }
      );

      const { message, data } = response.data;

      const updatedQuestions = questions.map((question) => {
        if (question.id === questionId) {
          return { ...question, votes: data.votes, selfVote: data.selfVote };
        }
        return question;
      });

      dispatch(setQuestions(updatedQuestions));
      toast.success(message);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    loading,
    fetchQuestionsError,
    questions,
    selfPostedQuestions,
    postLoadingQuestion,
    updateQuestionLoading,
    deleteQuestionLoading,
    deletingQuestionId,
    handleQuestionVoting,
    postQuestion,
    deleteQuestion,
    updateQuestion,
    fetchAllQuestions,
  };
};

export default useQuestions;
