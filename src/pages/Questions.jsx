import QuestionCard from "@/components/QuestionCard";
import ShimmerQuestionCard from "@/components/QuestionCard/shimmer";
import useQuestions from "@/hooks/useQuestions";
import { useEffect } from "react";

const Questions = () => {
  const {
    selfPostedQuestions,
    fetchQuestionsError,
    loading,
    deleteQuestion,
    updateQuestion,
    updateQuestionLoading,
    deleteQuestionLoading,
    deletingQuestionId,
    fetchAllQuestions,
  } = useQuestions();

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  return (
    <div className="min-h-full bg-white px-4 md:px-6 lg:px-8 pt-8">
      <div className="sticky top-0 bg-white z-30 pb-4 border-b">
        <h2 className="text-2xl md:text-3xl tracking-tighter font-semibold">
          My Questions
        </h2>
        <p className="my-4 text-gray-500 text-sm md:text-base">
          {selfPostedQuestions?.length !== 0
            ? "View and manage the questions you have posted."
            : "No questions found."}
        </p>

        <div>
          {fetchQuestionsError ? (
            <h1 className="text-red-500">{fetchQuestionsError}</h1>
          ) : loading ? (
            <div className="grid gap-4">
              <ShimmerQuestionCard />
              <ShimmerQuestionCard />
            </div>
          ) : (
            <div className="grid gap-4 ">
              {selfPostedQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  id={question.id}
                  title={question.title}
                  content={question.content}
                  context={question.context}
                  user={question.user}
                  createdAt={question.createdAt}
                  votes={question.votes}
                  selfVote={question.selfVote}
                  tags={question.tags}
                  answers={question.answers}
                  questionPage={true}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                  onUpdateLoading={updateQuestionLoading}
                  onDeletionLoading={deleteQuestionLoading}
                  deletingQuestionId={deletingQuestionId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
