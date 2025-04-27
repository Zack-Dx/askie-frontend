import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Clock,
  EditIcon,
  Trash2Icon,
  Loader2Icon,
  InfoIcon,
} from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "motion/react";
import useQuestions from "@/hooks/useQuestions";
import { useDispatch, useSelector } from "react-redux";
import { updateViewQuestion } from "@/redux/features/qna/qnaSlice";
import QnaForm from "../QnaForm";
import useAnswers from "@/hooks/useAnswers";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icons } from "../Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const initialData = { title: "", content: "" };

const CircularProgress = ({ percentage, size = 80, strokeWidth = 8 }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 200);

    return () => clearTimeout(timeout);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  const getColor = (value) => {
    if (value >= 80) return "#16a34a"; // Green
    if (value >= 60) return "#22c55e"; // Emerald
    if (value >= 40) return "#facc15"; // Amber
    if (value >= 20) return "#fb923c"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor(animatedPercentage)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s ease-in-out",
            filter: "drop-shadow(0 0 8px rgba(0,0,0,0.2))",
          }}
        />
      </svg>

      <span
        className="absolute font-bold"
        style={{
          fontSize: `${size * 0.3}px`,
          color: getColor(animatedPercentage),
          transition: "color 0.3s ease-in-out",
        }}
      >
        {animatedPercentage}
      </span>
    </div>
  );
};

const QuestionAnswer = ({ isLoading }) => {
  const user = useSelector((store) => store.user.data);
  const questionData = useSelector((store) => store.questions.view);
  // eslint-disable-next-line no-unused-vars
  const [params, _] = useSearchParams();
  const answerParam = params.get("answer");
  const notiParam = params.get("noti");
  const {
    postNewAnswer,
    isCreatingAnswerLoading,
    deleteAnswer,
    deleteAnswerLoading,
    deletingAnswerId,
    updateAnswer,
    updateAnswerLoading,
  } = useAnswers();

  const dispatch = useDispatch();
  const { handleQuestionVoting } = useQuestions();
  const { handleAnswerVoting } = useAnswers();

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const shimmerClass = "animate-pulse bg-gray-200/70";

  useEffect(() => {
    if (!notiParam || !answerParam) return;

    const scrollToAnswer = () => {
      const element = document.getElementById(`answer-${answerParam}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          element.classList.add("highlight-answer");
          setTimeout(() => {
            element.classList.remove("highlight-answer");
          }, 2000);
        }, 300);
      } else {
        setTimeout(scrollToAnswer, 500);
      }
    };

    scrollToAnswer();
  }, [notiParam, answerParam, questionData]);

  return (
    <div className="space-y-8 w-full p-6 bg-gray-50 rounded-xl shadow-lg">
      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex justify-between items-start">
              {isLoading ? (
                <div className={`h-9 w-2/3 rounded ${shimmerClass}`}></div>
              ) : (
                <CardTitle className="text-3xl font-bold text-gray-800 leading-tight">
                  {questionData?.title}
                </CardTitle>
              )}

              {isLoading ? (
                <div className={`h-6 w-28 rounded-full ${shimmerClass}`}></div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                  <Clock size={16} className="text-primary" />
                  <span>{formatDate(questionData?.createdAt)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {isLoading ? (
                <>
                  <div
                    className={`h-5 w-16 rounded-full ${shimmerClass}`}
                  ></div>
                  <div
                    className={`h-5 w-20 rounded-full ${shimmerClass}`}
                  ></div>
                </>
              ) : (
                questionData?.tags?.map((tag) => (
                  <Badge
                    key={tag.tag.id}
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                  >
                    {tag.tag.name}
                  </Badge>
                ))
              )}
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="flex gap-6">
              {/* Voting Section */}
              <div className="flex flex-col items-center space-y-2 text-sm font-medium flex-shrink-0">
                {isLoading ? (
                  <>
                    <div
                      className={`h-9 w-9 rounded-full ${shimmerClass}`}
                    ></div>
                    <div className={`h-6 w-6 rounded ${shimmerClass}`}></div>
                    <div
                      className={`h-9 w-9 rounded-full ${shimmerClass}`}
                    ></div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        const data = await handleQuestionVoting(
                          1,
                          questionData?.id
                        );
                        if (data) {
                          dispatch(updateViewQuestion(data));
                        }
                      }}
                      className={`rounded-full transition-all duration-300 ${
                        questionData?.selfVote === 1
                          ? "bg-primary text-white shadow-md hover:bg-primary-hover hover:text-white"
                          : "bg-transparent text-primary"
                      }`}
                    >
                      <ArrowBigUp className="h-6 w-6" />
                      <span className="sr-only">Upvote</span>
                    </Button>
                    <span className="text-2xl font-bold text-primary">
                      {questionData?.votes}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        const data = await handleQuestionVoting(
                          -1,
                          questionData?.id
                        );
                        if (data) {
                          dispatch(updateViewQuestion(data));
                        }
                      }}
                      className={`rounded-full transition-all duration-300 ${
                        questionData?.selfVote === -1
                          ? "bg-destructive text-white shadow-md hover:bg-destructive-hover hover:text-white"
                          : "text-destructive hover:text-destructive-hover"
                      }`}
                    >
                      <ArrowBigDown className="h-6 w-6" />
                      <span className="sr-only">Downvote</span>
                    </Button>
                  </>
                )}
              </div>

              {/* Question Content */}
              <div className="flex-1 prose max-w-6xl h-fit overflow-y-auto scrollbar-hide">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className={`h-3 w-full rounded ${shimmerClass}`}></div>
                    <div className={`h-3 w-5/6 rounded ${shimmerClass}`}></div>
                    <div className={`h-3 w-full rounded ${shimmerClass}`}></div>
                    <div className={`h-3 w-4/6 rounded ${shimmerClass}`}></div>
                    <div className={`h-3 w-full rounded ${shimmerClass}`}></div>
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: questionData?.content }}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 py-4">
            <div className="flex items-center space-x-3 ml-auto">
              {isLoading ? (
                <>
                  <div className={`h-8 w-8 rounded-full ${shimmerClass}`}></div>
                  <div>
                    <div
                      className={`h-3 w-20 rounded ${shimmerClass} mb-1`}
                    ></div>
                    <div className={`h-2 w-24 rounded ${shimmerClass}`}></div>
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="w-8 h-8 border">
                    <AvatarImage
                      src={questionData?.user?.picture}
                      alt={questionData?.user?.name}
                    />
                    <AvatarFallback>
                      {questionData?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-700 mr-1">
                        {questionData?.user?.name}
                      </p>
                      {questionData?.user?.isPremium && <Icons.verified />}
                    </div>

                    <p className="text-xs text-gray-500">
                      Asked {formatDate(questionData?.createdAt)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Answers Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {isLoading ? (
            <>
              <div className={`h-7 w-32 rounded ${shimmerClass}`}></div>
              <div className={`h-9 w-28 rounded ${shimmerClass}`}></div>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-gray-800">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                {questionData?.answers?.length} Answers
              </h2>
              {questionData?.userId !== user?.id && (
                <div className="w-full sm:w-auto">
                  <QnaForm
                    isAnswerForm={true}
                    triggerContent={"Add Your Answer"}
                    formTitle={"Type your Answer"}
                    defaultValue={initialData}
                    submitBtnText="Post your Answer"
                    submissionHandler={(content) => {
                      return postNewAnswer(content, questionData.id);
                    }}
                    submissionLoading={isCreatingAnswerLoading}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <Separator className="bg-gray-200" />

        {/* Answer List */}
        <motion.div className="space-y-6" layout>
          {isLoading ? (
            // Shimmer loader
            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <div className="flex gap-3 sm:gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full ${shimmerClass}`}
                    ></div>
                    <div
                      className={`h-5 w-5 sm:h-6 sm:w-6 rounded ${shimmerClass}`}
                    ></div>
                    <div
                      className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full ${shimmerClass}`}
                    ></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className={`h-3 w-full rounded ${shimmerClass}`}></div>
                    <div className={`h-3 w-5/6 rounded ${shimmerClass}`}></div>
                    <div className={`h-3 w-3/4 rounded ${shimmerClass}`}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : questionData?.answers?.length > 0 ? (
            questionData.answers.map((answer, index) => (
              <motion.div
                key={answer?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex gap-3 sm:gap-6">
                      {/* Voting Section */}
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2 text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAnswerVoting(1, answer?.id)}
                          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-all duration-300 text-primary ${
                            answer?.selfVote === 1
                              ? "text-white hover:bg-primary hover:text-white bg-primary shadow-md"
                              : "bg-transparent text-black"
                          }`}
                        >
                          <ArrowBigUp className="h-5 w-5 sm:h-6 sm:w-6" />
                          <span className="sr-only">Upvote</span>
                        </Button>
                        <span className="text-lg sm:text-xl font-bold text-primary">
                          {answer?.votes}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-all duration-300 ${
                            answer?.selfVote === -1
                              ? "bg-destructive text-white shadow-md hover:bg-destructive-hover hover:text-white"
                              : "text-destructive hover:text-destructive-hover"
                          }`}
                          onClick={() => handleAnswerVoting(-1, answer?.id)}
                        >
                          <ArrowBigDown className="h-5 w-5 sm:h-6 sm:w-6" />
                          <span className="sr-only">Downvote</span>
                        </Button>
                      </div>

                      {/* Answer Content */}
                      <div
                        id={`answer-${answer.id}`}
                        className="flex-1 space-y-4 prose max-w-none prose-sm sm:prose-base"
                      >
                        <div className="flex items-center mb-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1 w-fit">
                                  <CircularProgress
                                    percentage={answer?.factScore || 0}
                                    size={32}
                                    strokeWidth={3}
                                  />
                                  <span className="text-xs text-gray-600 font-medium mr-1">
                                    Fact Score
                                  </span>
                                  <InfoIcon className="h-3.5 w-3.5 text-gray-400" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  This score indicates how factual and useful
                                  this answer is based on factual accuracy and
                                  content analysis.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div
                          dangerouslySetInnerHTML={{ __html: answer.content }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  {/* User Information + Update & Delete Buttons */}
                  <CardFooter className="bg-gray-50 py-3 sm:py-4 flex flex-col sm:flex-row gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3 w-full sm:w-auto sm:ml-auto order-2 sm:order-1">
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border">
                        <AvatarImage
                          src={answer?.user?.picture}
                          alt={answer?.user?.name}
                        />
                        <AvatarFallback>
                          {answer?.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex">
                          <p className="text-xs sm:text-sm font-medium text-gray-700 mr-1">
                            {answer?.user?.name}
                          </p>
                          {answer?.user?.isPremium && <Icons.verified />}
                        </div>
                        <p className="text-xs text-gray-500 mr-3">
                          Answered {formatDate(answer?.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Owner Controls */}
                    {answer?.userId === user?.id && (
                      <div className="flex space-x-2 w-full sm:w-auto order-1">
                        <div className="ml-auto flex space-x-2">
                          {/* Update Button */}
                          <QnaForm
                            isAnswerForm={true}
                            triggerContent={""}
                            formTitle={"Update your Answer"}
                            submitBtnText="Update"
                            defaultValue={{
                              title: "",
                              content: answer?.content,
                            }}
                            submissionHandler={(state) =>
                              updateAnswer(answer?.id, state)
                            }
                            submissionLoading={updateAnswerLoading}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 bg-white hover:bg-gray-100 text-gray-700"
                            >
                              <EditIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Update
                            </Button>
                          </QnaForm>

                          {/* Delete Button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            className={cn(
                              "border rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 bg-destructive text-white hover:bg-destructive-hover",
                              deleteAnswerLoading &&
                                answer?.id === deletingAnswerId &&
                                "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => deleteAnswer(answer?.id)}
                          >
                            {deleteAnswerLoading &&
                            answer?.id === deletingAnswerId ? (
                              <Loader2Icon className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-lg font-semibold text-gray-600">
                No answers yet.
              </p>
              <p className="text-sm text-gray-500">
                Be the first one to answer this!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionAnswer;

QuestionAnswer.propTypes = {
  isLoading: PropTypes.bool,
  questionData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    selfVote: PropTypes.number,
    votes: PropTypes.number,
    createdAt: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      picture: PropTypes.string,
      isPremium: PropTypes.bool,
    }),
  }),
};

CircularProgress.propTypes = {
  percentage: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};
