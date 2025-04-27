import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Clock,
  Edit,
  Trash2,
  Loader2Icon,
  FileText,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import PropTypes from "prop-types";
import QnaForm from "../QnaForm";
import useQuestions from "@/hooks/useQuestions";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuthentication from "@/hooks/useAuthentication";
import { CONFIG } from "@/constants";
import axios from "axios";
import { Icons } from "../Icons";

export default function QuestionCard({
  id,
  title,
  content,
  user,
  createdAt,
  tags,
  context,
  votes,
  selfVote,
  answers,
  questionPage = false,
  onUpdate,
  onUpdateLoading,
  onDelete,
  onDeletionLoading,
  deletingQuestionId,
}) {
  const { user: loggedInUser } = useAuthentication();
  const { handleQuestionVoting } = useQuestions();
  const [isOpen, setIsOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarisedData, setSummarizedData] = useState("");

  const handleSummaryBtnClick = async (questionId) => {
    setIsOpen(true);
    setSummaryLoading(true);
    try {
      const response = await axios.get(
        `${CONFIG.BACKEND_API_URL}/questions/summary/${questionId}`,
        {
          withCredentials: true,
        }
      );
      const { data } = response.data;
      setSummarizedData(data.summary);
    } catch (error) {
      console.error("Failed to get summary", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const SummaryButton = () => {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-4 right-4 z-10"
        >
          <Button
            onClick={() => {
              handleSummaryBtnClick(id);
            }}
            disabled={summaryLoading}
            className="rounded-full text-white font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 group"
            size="sm"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <FileText className="h-4 w-4" />
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0, 1, 0],
                  rotate: [0, 15, 0, -15, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 2,
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </motion.div>
            </motion.div>
            <span className="relative overflow-hidden">
              <span className="inline-block">
                {summaryLoading ? "Generating..." : "Summary"}
              </span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </Button>
        </motion.div>

        <AnimatePresence>
          {!summaryLoading && isOpen && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-3xl overflow-hidden p-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader className="p-6 pb-2 bg-primary/5">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Content Summary
                    </DialogTitle>
                  </DialogHeader>

                  <div className="p-6 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                        Question
                      </h3>
                      <p className="text-primary font-medium text-lg">
                        {title}
                      </p>
                    </motion.div>

                    {summarisedData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="space-y-2"
                      >
                        <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                          Summary
                        </h3>
                        <p className="text-sm text-gray-600">
                          {summarisedData}
                        </p>
                      </motion.div>
                    )}

                    {tags && tags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="space-y-2"
                      >
                        <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag.tag.id}
                              variant="secondary"
                              className="bg-primary/10 text-primary"
                            >
                              {tag.tag.name}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="space-y-2"
                    >
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
                        Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Answers:</span>
                          <span>{answers?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Posted:</span>
                          <span>
                            {new Date(createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <span className="font-medium">Author:</span>
                          <span>{user.name}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50 m-0 relative">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Vote column */}
          {!questionPage && (
            <div className="flex flex-col items-center space-y-2 text-sm font-medium">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuestionVoting(1, id)}
                      className={`rounded-full transition-all duration-300 ${
                        selfVote === 1
                          ? "bg-primary text-white shadow-md hover:bg-primary-hover hover:text-white"
                          : "bg-transparent text-primary"
                      }`}
                    >
                      <ArrowBigUp className="h-6 w-6" />
                      <span className="sr-only">Upvote</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upvote</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <span className="text-xl font-bold text-black">{votes}</span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuestionVoting(-1, id)}
                      className={`rounded-full transition-all duration-300 ${
                        selfVote === -1
                          ? "bg-destructive text-white shadow-md hover:bg-destructive-hover hover:text-white"
                          : "text-destructive hover:text-destructive-hover"
                      }`}
                    >
                      <ArrowBigDown className="h-6 w-6" />
                      <span className="sr-only">Downvote</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Downvote</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {/* Main content */}
          <Link
            to={`/view/question/${id}`}
            className="flex-1 min-w-0 space-y-3"
          >
            <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-gray-600 font-medium line-clamp-2">
              <span className="font-semibold">Context:</span> {context}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <Badge
                  key={tag.tag.id}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {`${tag.tag.name}`}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-blue-600">
                  <MessageSquare size={14} />
                  <span>{answers.length} answers</span>
                </span>
                <span className="flex items-center space-x-1 text-orange-600">
                  <Clock size={14} />
                  <span>{moment(createdAt).fromNow()}</span>
                </span>
              </div>
            </div>
          </Link>
          {/* User info or Update/Delete buttons */}
          {questionPage ? (
            <div className="flex flex-col space-y-2">
              <QnaForm
                triggerContent={""}
                formTitle={"Update your Question"}
                defaultValue={{ title, content }}
                submitBtnText="Update"
                submissionHandler={(state) => onUpdate(id, state)}
                submissionLoading={onUpdateLoading}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 bg-white hover:bg-gray-100 text-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </QnaForm>

              <Button
                variant="destructive"
                size="sm"
                disabled={onDeletionLoading}
                className={cn(
                  "border rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 bg-destructive text-white hover:bg-destructive-hover",
                  onDeletionLoading &&
                    id === deletingQuestionId &&
                    "opacity-50 cursor-not-allowed"
                )}
                onClick={() => onDelete(id)}
              >
                {onDeletionLoading && id === deletingQuestionId ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={user.picture} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {user.isPremium && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-background p-0.5">
                    <Icons.verified />
                  </div>
                )}
              </div>

              <div className="text-sm">
                <p className="font-medium text-gray-700">
                  {user.name?.split(" ")[0]}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {!questionPage &&
        user.id !== loggedInUser.id &&
        loggedInUser.isPremium && <SummaryButton />}
    </Card>
  );
}

QuestionCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isPremium: PropTypes.bool.isRequired,
  }).isRequired,
  createdAt: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  selfVote: PropTypes.number.isRequired,
  tags: PropTypes.array,
  answers: PropTypes.array.isRequired,
  questionPage: PropTypes.bool,
  onUpdate: (props, propName, componentName) => {
    if (props.questionPage && typeof props[propName] !== "function") {
      return new Error(
        `${propName} is required and should be a function in ${componentName} when questionPage is true.`
      );
    }
  },
  onUpdateLoading: PropTypes.bool,
  onDelete: (props, propName, componentName) => {
    if (props.questionPage && typeof props[propName] !== "function") {
      return new Error(
        `${propName} is required and should be a function in ${componentName} when questionPage is true.`
      );
    }
  },
  onDeletionLoading: PropTypes.bool,
  deletingQuestionId: PropTypes.string,
};
