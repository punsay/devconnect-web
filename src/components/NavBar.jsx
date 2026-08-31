import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/conectionSlice";
import { removeRequests } from "../utils/requestSlice";
import { useState } from "react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(removeRequests());
      return navigate("/login");
    } catch {
      setError("Logout failed. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <>
    {error && (
      <div className="toast toast-top toast-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    )}
    <div className="navbar border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-white">
          👩‍💻 DevConnect
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="hidden text-slate-300 sm:block">
            Welcome, {user.firstName}
          </div>
          <div className="dropdown dropdown-end mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 border border-white/10 bg-slate-800 p-2 text-slate-200 shadow-xl"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>

              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
    </>
  );
};
export default NavBar;
