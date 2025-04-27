import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { AskiePremiumCard } from "@/components/PremiumCard";
import useAuthentication from "@/hooks/useAuthentication";
import { AvatarImage } from "@radix-ui/react-avatar";
import { CONFIG } from "@/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  askieFreeQuotaUsed,
  askiePremiumQuotaUsed,
} from "@/redux/features/user/userSlice";
import { toast } from "sonner";

const MAX_DOM_MESSAGE_LIMIT = 20;
const initialMessages = [
  {
    id: "1Askie",
    message:
      "Hello! 👋 I'm Askie. How can I help you with your coding doubts today? 💻",
    role: "assistant",
    createdAt: new Date(),
  },
];

const Askie = () => {
  const dispatch = useDispatch();
  const { user } = useAuthentication();
  const [showPremium, setShowPremium] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchPrevConversation = async () => {
    try {
      const response = await axios.get(`${CONFIG.BACKEND_API_URL}/askie-chat`, {
        withCredentials: true,
      });
      const { data } = response.data;
      setMessages((prev) => [...prev, ...data.messages]);
    } catch (error) {
      console.error("Failed to load chat", error);
    }
  };

  useEffect(() => {
    fetchPrevConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askAskieHandler = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/askie-answer`,
        {
          query,
        },
        { withCredentials: true }
      );
      const { data } = response.data;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        message: "",
        role: "model",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage].slice(-MAX_DOM_MESSAGE_LIMIT));

      const REFRESH_INTERVAL = 20;
      let index = 0;
      let intervalId = setInterval(() => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((prevMsg) => {
            if (index < data?.message?.length) {
              if (prevMsg.id === aiMessage.id) {
                const content = data?.message?.slice(0, index + 1);
                index++;
                return {
                  ...prevMsg,
                  message: content,
                };
              }
            }
            return prevMsg;
          });
          return updatedMessages;
        });

        if (index >= data?.message?.length) {
          clearInterval(intervalId);
        }
      }, REFRESH_INTERVAL);

      if (user.isPremium) {
        dispatch(askiePremiumQuotaUsed());
      } else {
        dispatch(askieFreeQuotaUsed());
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (user.freeAskieQuota === 0 && !user.isPremium) {
      setShowPremium(true);
      toast.error("Free Usage Limit Reached!");
      return;
    }

    if (user.premiumAskieQuota === 0 && user.isPremium) {
      toast.error("Daily Usage Limit Reached! Try again tomorrow");
      return;
    }

    askAskieHandler(input);

    const userMessage = {
      id: Date.now().toString(),
      message: input,
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-6">
      <Card className="w-full h-[85vh] my-6 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">
            Ask <span className="text-destructive">Askie</span>
          </CardTitle>
        </CardHeader>

        {!user.isPremium && showPremium && (
          <AskiePremiumCard onClose={() => setShowPremium(false)} />
        )}

        <CardContent className="flex-grow overflow-y-auto scrollbar-hide p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className={`h-8 w-8`}>
                  <AvatarImage
                    src={`${
                      message.role === "user"
                        ? user?.picture
                        : "https://cdn-icons-png.flaticon.com/512/2040/2040946.png"
                    }`}
                    className="bg-white w-full"
                  />
                  <AvatarFallback>
                    {message.role === "user" ? user.name[0].toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.message}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-destructive-foreground"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      "https://cdn-icons-png.flaticon.com/512/2040/2040946.png"
                    }
                    className="bg-white w-full"
                  />
                </Avatar>
                <div className="rounded-lg p-3 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t p-4 mt-auto">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Type your message here..."
              className="flex-grow resize-none min-h-[50px] max-h-[200px]"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-[60px] w-[50px] bg-destructive hover:bg-destructive-hover"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Askie;
