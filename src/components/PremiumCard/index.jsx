import {
  Crown,
  Zap,
  Users,
  ArrowRight,
  Check,
  X,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropTypes from "prop-types";
import { useState } from "react";
import { Badge } from "../ui/badge";
import usePayment from "@/hooks/usePayment";

const PremiumFeature = ({ icon, text }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <span className="text-sm">{text}</span>
  </div>
);

export default function PremiumCard() {
  const [showOptions, setShowOptions] = useState(false);
  const { isProcessing, subscriptionPurchaseHandler } = usePayment();

  const showSubscriptionOptionsHandler = () => {
    setShowOptions(true);
  };

  return (
    <Card className="border-sidebar-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-sidebar-primary">
          <Crown className="h-5 w-5" />
          <span className="text-lg font-medium">Go Premium</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sidebar-foreground">
        <PremiumFeature
          icon={<Zap className="h-4 w-4 text-[hsl(var(--chart-1))]" />}
          text="Unlimited Q&A"
        />
        <PremiumFeature
          icon={<Users className="h-4 w-4 text-[hsl(var(--chart-2))]" />}
          text="Exclusive community"
        />
        <PremiumFeature
          icon={<Crown className="h-4 w-4 text-[hsl(var(--chart-3))]" />}
          text="Ad-free experience"
        />
      </CardContent>
      <CardFooter className="flex items-center space-x-2">
        {!showOptions && (
          <Button
            disabled={showOptions}
            onClick={showSubscriptionOptionsHandler}
            className="flex-1 bg-destructive hover:bg-destructive-hover text-sidebar-primary-foreground animate-pulse"
          >
            <SparklesIcon />
            Upgrade Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {showOptions && (
          <>
            <Button
              onClick={() => {
                subscriptionPurchaseHandler("monthly");
              }}
              size="sm"
              variant="outline"
              disabled={isProcessing}
              className={`w-20 ${
                isProcessing === "monthly" ? "cursor-wait opacity-50" : ""
              } bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90 transition-colors w-full`}
            >
              {isProcessing === "monthly" ? "Hold On..." : "Monthly"}
            </Button>
            <Button
              onClick={() => {
                subscriptionPurchaseHandler("yearly");
              }}
              size="sm"
              disabled={isProcessing}
              className={`w-20 ${
                isProcessing === "yearly" ? "cursor-wait opacity-50" : ""
              } bg-destructive text-primary-foreground hover:bg-destructive-hover transition-colors w-full`}
            >
              {isProcessing === "yearly" ? "Hold On..." : "Yearly"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

const AskiePremiumCard = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const { isProcessing, subscriptionPurchaseHandler } = usePayment();

  const plans = {
    monthly: {
      price: 1,
      label: "1 Month Access",
    },
    yearly: {
      price: 10,
      label: "1 Year Access",
      savings: 20,
    },
  };

  const premiumFeatures = [
    "Verified Askie Badge",
    "Priority response time",
    "Increased Query Limits",
    "Better Context Preservation",
  ];

  const handlePurchase = () => {
    subscriptionPurchaseHandler(selectedPlan);
  };

  return (
    <div className="fixed inset-0 bg-background/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-primary/20 relative">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-muted-foreground hover:text-primary transition"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl font-bold text-center">
              Upgrade to Askie Premium
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              You&apos;ve reached your free message limit
            </p>
          </CardHeader>

          <CardContent className="pt-4 pb-2">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Monthly Option */}
              <Card
                className={`border cursor-pointer transition-all ${
                  selectedPlan === "monthly"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <CardContent className="p-3 text-center">
                  <div className="font-medium">{plans.monthly.label}</div>
                  <div className="text-2xl font-bold mt-1">
                    ₹{plans.monthly.price}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    One-time payment
                  </div>
                </CardContent>
              </Card>

              {/* Yearly Option */}
              <Card
                className={`border cursor-pointer transition-all relative overflow-hidden ${
                  selectedPlan === "yearly"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setSelectedPlan("yearly")}
              >
                <Badge
                  variant="default"
                  className="absolute top-0 bg-destructive right-0 rounded-tl-none rounded-br-none text-[10px] px-1.5 py-0"
                >
                  SAVE {plans.yearly.savings}%
                </Badge>
                <CardContent className="p-3 text-center">
                  <div className="font-medium">{plans.yearly.label}</div>
                  <div className="text-2xl font-bold mt-1">
                    ₹{plans.yearly.price}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    One-time payment
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2 mb-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-destructive mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-2">
            <Button
              disabled={isProcessing}
              className="w-full bg-destructive hover:bg-destructive-hover"
              onClick={handlePurchase}
            >
              Buy Now
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-1">
              Secure payment • Instant access • No recurring charges
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

PremiumFeature.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

AskiePremiumCard.propTypes = {
  onClose: PropTypes.func,
};

export { AskiePremiumCard };
