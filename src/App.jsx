import axios from "axios";
import { Outlet } from "react-router-dom";
import { CONFIG } from "./constants";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { clearUser, setUser } from "./redux/features/user/userSlice";
import Loader from "./components/Loader";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${CONFIG.BACKEND_API_URL}/profile`, {
          withCredentials: true,
        });
        const user = response.data.data;
        dispatch(setUser(user));
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        dispatch(clearUser());
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) return <Loader />;

  return (
    <main>
      <Outlet />
      <Toaster />
    </main>
  );
};

export default App;
