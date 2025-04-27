import { useSelector } from "react-redux";

const useAuthentication = () => {
  const { data: user, isAuthenticated } = useSelector((store) => store.user);
  return { user, isAuthenticated };
};

export default useAuthentication;
