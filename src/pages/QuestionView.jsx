import QuestionAnswer from "@/components/QuestionAnswer";
import { CONFIG } from "@/constants";
import { setViewQuestion } from "@/redux/features/qna/qnaSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const QuestionView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuestionDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${CONFIG.BACKEND_API_URL}/questions/${id}`,
        {
          withCredentials: true,
        }
      );
      const { data } = response.data;
      dispatch(setViewQuestion(data));
    } catch (error) {
      console.error("An error occured while fetching details", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setViewQuestion(null));
    fetchQuestionDetails(id);
  }, [id]);

  return (
    <>
      <QuestionAnswer isLoading={isLoading} />
    </>
  );
};

export default QuestionView;
