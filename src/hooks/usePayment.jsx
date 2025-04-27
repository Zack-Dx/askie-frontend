import { useState } from "react";
import { CONFIG } from "@/constants";
import { siteConfig } from "@/constants/site";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeUserPremium } from "@/redux/features/user/userSlice";

const usePayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const verifyPremiumUser = async () => {
    try {
      const response = await axios.get(
        `${CONFIG.BACKEND_API_URL}/payment/premium/verify`,
        {
          withCredentials: true,
        }
      );

      const { data } = response.data;

      if (data.isPremium) {
        dispatch(makeUserPremium());
      }
      navigate("/premium-success");
    } catch (error) {
      console.error(error, "Error in verifying user premium");
    }
  };

  const subscriptionPurchaseHandler = async (membershipType) => {
    setIsProcessing(membershipType);
    try {
      const response = await axios.post(
        `${CONFIG.BACKEND_API_URL}/payment/create`,
        { membershipType },
        { withCredentials: true }
      );

      const { payment: data, key_id } = response.data.data;
      const options = {
        key: key_id,
        amount: data.amount,
        currency: data.currency,
        name: `${siteConfig.name} Premium`,
        description: "Premium Subscription",
        order_id: data.orderId,
        prefill: {
          name: data.notes.name,
          email: data.notes.email,
        },
        notes: {
          membershipType: data.notes.membershipType,
        },
        modal: {
          escape: true,
          ondismiss: () => setIsProcessing(null),
        },
        handler: verifyPremiumUser,
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in payment handler:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  return { isProcessing, subscriptionPurchaseHandler };
};

export default usePayment;
