import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/login"];

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const [isAuthChecking, setIsAuthChecking] = useState(!user);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  useEffect(() => {
    const verifyAuth = async () => {
      if (user) {
        setIsAuthChecking(false);
        return;
      }

      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch {
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsAuthChecking(false);
      }
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    if (isAuthChecking) return;

    if (user && location.pathname === "/login") {
      navigate("/", { replace: true });
    } else if (!user && !PUBLIC_ROUTES.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [isAuthChecking, user, location.pathname, navigate]);

  if (isAuthChecking || (!user && !isPublicRoute)) {
    return (
      <div className="min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};
export default Body;
