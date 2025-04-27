import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthentication from "@/hooks/useAuthentication";

export default function PremiumSuccess() {
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (!user.isPremium) {
      navigate("/");
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-16 bg-gradient-to-b from-background to-secondary/20 p-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={false}
        colors={["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"]}
      />

      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6 animate-fade-in-up">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <CheckCircle className="h-12 w-12 text-destructive" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Askie Premium Activated!
          </span>
        </h1>

        <p className="text-xl text-muted-foreground">
          Congratulations! You now have access to all premium features.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center w-full">
          <Button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 py-6"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </Button>

          <Button
            onClick={() => navigate("/askie")}
            variant="outline"
            className="flex items-center justify-center bg-destructive hover:bg-destructive-hover text-primary-foreground hover:text-primary-foreground gap-2 py-6"
            size="lg"
          >
            <ChevronRight className="h-5 w-5" />
            Explore Ask Askie
          </Button>
        </div>
      </div>
    </div>
  );
}
