import { useState, useEffect } from "react";
import { Loader2Icon, Mail, Sparkles, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CONFIG } from "@/constants";
import axios from "axios";
import {
  subscribeNewsLetter,
  unSubscribeNewsLetter,
} from "@/redux/features/user/userSlice";
import { Link } from "react-router-dom";

export default function NewsletterCard() {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const isSubscribed = useSelector((store) => store.user.data.isNewsSub);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${CONFIG.BACKEND_API_URL}/articles`, {
        withCredentials: true,
      });
      const { data } = response.data;
      setArticles(data?.articles);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    fetchArticles();
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (action) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/newsletter`,
        { action },
        { withCredentials: true }
      );
      const { message } = response.data;
      if (action == 1) {
        dispatch(subscribeNewsLetter());
      } else {
        dispatch(unSubscribeNewsLetter());
      }
      toast.success(message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setAnimateIn(false);
    setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative w-full transition-all duration-700 ease-out ${
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <Card className="w-full overflow-hidden border-sidebar-border bg-gradient-to-br from-background/90 via-background to-background/80 backdrop-blur-md shadow-md">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground/50 hover:text-foreground transition-colors z-10"
          aria-label="Dismiss newsletter"
        >
          <X size={14} />
        </button>

        <div className="relative p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary/10 text-sidebar-primary">
              <Mail className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold tracking-tight flex items-center">
              Insider Weekly
              <Sparkles className="h-3 w-3 text-chart-1 ml-1" />
            </h3>
          </div>

          {isSubscribed ? (
            <div className="py-2 space-y-1">
              <div className="flex items-center gap-1 text-sidebar-primary">
                <Sparkles className="h-4 w-4" />
                <h4 className="font-medium text-sm">You&apos;re in!</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Already subscribed.
              </p>
              <Button
                onClick={() => handleSubscribe(-1)}
                variant="outline"
                disabled={loading}
                className="w-full border-destructive text-destructive hover:text-destructive"
              >
                {!loading ? (
                  "Unsubscribe"
                ) : (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-foreground/90">
                Join our curated newsletter & insider for exclusive insights and
                expert tips.
              </p>
              <Button
                onClick={() => handleSubscribe(1)}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover"
              >
                {!loading ? (
                  "Subscribe"
                ) : (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                )}
              </Button>
              <div className="flex gap-1 items-center text-[10px] text-muted-foreground">
                <Star className="h-3 w-3 fill-chart-1 text-chart-1" />
                <span>4.9/5 from 2,300+ subscribers</span>
              </div>
            </div>
          )}
        </div>

        {/* Preview section */}
        {articles?.length > 0 && (
          <div className="relative mt-2 p-3 pt-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-border/30"></div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Latest Tech Articles
              </span>
              <div className="h-px flex-1 bg-border/30"></div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {articles.map(({ id, title, url, social_image }) => (
                <Link
                  to={url}
                  key={id}
                  className="group relative overflow-hidden rounded aspect-[4/3] bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                  <img
                    src={social_image}
                    alt={`Preview ${id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-1">
                    <p className="text-[8px] font-medium text-white truncate">
                      {title}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-sidebar-primary/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-medium text-white">
                      Read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
