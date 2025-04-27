import useQuestions from "@/hooks/useQuestions";
import QnaForm from "@/components/QnaForm";
import QuestionCard from "@/components/QuestionCard";
import ShimmerQuestionCard from "@/components/QuestionCard/shimmer";
import PremiumCard, { AskiePremiumCard } from "@/components/PremiumCard";
import NewsletterCard from "@/components/NewsletterCard";
import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import useAuthentication from "@/hooks/useAuthentication";
import { SparklesIcon } from "lucide-react";

const Home = () => {
  const { user } = useAuthentication();
  const [showPremium, setShowPremium] = useState(false);
  const {
    loading,
    error,
    questions,
    postLoadingQuestion,
    fetchAllQuestions,
    postQuestion,
  } = useQuestions();

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const handleShowPremium = () => {
    setShowPremium((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-12 min-h-full bg-white pt-3 md:gap-4">
      {/* Main Content Column */}
      <div className="col-span-12 lg:col-span-8">
        {!user.isPremium && (
          <div
            onClick={handleShowPremium}
            className="cursor-pointer lg:hidden col-span-12 px-4 mb-5"
          >
            <div
              role="button"
              aria-label="Subscribe Premium Button"
              className="bg-destructive text-primary-foreground border-l-8 border-red-700 p-4 rounded-md shadow-sm"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2 animate-pulse">
                <SparklesIcon className="h-5 w-5" />
                <span>Click to Go Premium!</span>
              </h3>
              <p className="text-sm">Unlock exclusive features and benefits.</p>
            </div>
          </div>
        )}
        {showPremium && <AskiePremiumCard onClose={handleShowPremium} />}
        <div className="sticky top-14 bg-white z-30 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <Icons.wave />
                <h2 className="text-2xl sm:text-3xl tracking-tighter font-semibold">
                  Welcome back,{" "}
                  <span className={user.isPremium ? "text-destructive" : ""}>
                    {user.name}
                  </span>
                </h2>
              </div>
              <p className="my-1 text-gray-500 text-sm">
                Find answers to your technical questions and help others answer
                theirs.
              </p>
            </div>

            <div className="flex justify-end">
              <QnaForm
                triggerContent={"Ask a question"}
                formTitle={"Ask a public question"}
                submitBtnText="Post your Question"
                submissionHandler={postQuestion}
                submissionLoading={postLoadingQuestion}
              />
            </div>
          </div>
        </div>

        {/* Questions Content */}
        <div className="px-6 py-6 w-full">
          {error ? (
            <h1 className="text-red-500">{error}</h1>
          ) : loading ? (
            <div className="flex flex-col gap-4">
              <ShimmerQuestionCard />
              <ShimmerQuestionCard />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {questions.map((question) => (
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
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Desktop Only */}
      <div className="hidden lg:block lg:col-span-4">
        <div className="sticky top-10 right-0 w-full py-8 mr-4 mx-auto">
          <div className="space-y-4">
            {!user.isPremium && <PremiumCard />}
            <NewsletterCard />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Mobile Version */}
      <div className="lg:hidden col-span-12 px-4 py-4">
        <div className="space-y-2">
          {!user.isPremium && <PremiumCard />}
          <NewsletterCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
