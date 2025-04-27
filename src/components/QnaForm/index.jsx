import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LoaderCircleIcon, SquarePenIcon } from "lucide-react";
import RichEditor from "../Editor";
import PropTypes from "prop-types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const initialData = { title: "", content: "" };

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };

    case "SET_CONTENT":
      return { ...state, content: action.payload };

    case "RESET_FORM":
      return action.payload;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const QnaForm = ({
  triggerContent,
  formTitle,
  defaultValue = null,
  submissionLoading,
  submissionHandler,
  submitBtnText = "Submit",
  children,
  isAnswerForm = false,
}) => {
  const [state, dispatch] = useReducer(reducer, defaultValue || initialData);
  const [isDialogBoxOpen, setIsDialogBoxOpen] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    if (defaultValue) {
      dispatch({ type: "RESET_FORM", payload: defaultValue });
    }
  }, [defaultValue]);

  const handleContentChange = useCallback((value) => {
    dispatch({ type: "SET_CONTENT", payload: value });
  }, []);

  const handleTitleChange = (value) => {
    dispatch({ type: "SET_TITLE", payload: value });
  };

  const handleReset = () => {
    dispatch({ type: "RESET_FORM", payload: defaultValue || initialData });
    if (editorRef.current) {
      const contentToRestore =
        defaultValue?.content || initialData?.content || "";
      editorRef.current.clearEditor(contentToRestore);
    }
  };

  const handleSubmit = async () => {
    if (state.content.length > 10000) {
      alert("Content exceeds the 10,000-character limit.");
      return;
    }
    const success = await submissionHandler(state);
    if (success) {
      setIsDialogBoxOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={isDialogBoxOpen} onOpenChange={setIsDialogBoxOpen}>
          <DialogTrigger asChild>
            {children ? (
              children
            ) : (
              <Button className="flex items-center space-x-2">
                <span>{triggerContent}</span> <SquarePenIcon />
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="max-w-fit">
            <DialogTitle>
              <p className="font-bold text-2xl my-4">{formTitle}</p>
            </DialogTitle>
            {!isAnswerForm && (
              <>
                {/* Title Input */}
                <div className="mb-4">
                  <Label htmlFor="title" className="block mb-2">
                    Title
                  </Label>
                  <Input
                    id="title"
                    autoFocus
                    value={state.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter your title here"
                  />
                </div>
              </>
            )}
            {/*Content Input */}
            <RichEditor
              ref={editorRef}
              content={state.content}
              handleContentChange={handleContentChange}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
              <Button
                disabled={submissionLoading}
                className={submissionLoading ? "opacity-80" : "opacity-100"}
                onClick={handleSubmit}
              >
                {submissionLoading ? "Validating Relevance" : submitBtnText}
                {submissionLoading && (
                  <LoaderCircleIcon className="animate-spin" />
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default QnaForm;

QnaForm.propTypes = {
  triggerContent: PropTypes.string,
  formTitle: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  submissionHandler: PropTypes.func,
  submitBtnText: PropTypes.string,
  submissionLoading: PropTypes.bool,
  children: PropTypes.node,
  isAnswerForm: PropTypes.bool,
};
