import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(getApiErrorMessage(err, "Sign up failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (isLoginForm) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  const toggleForm = () => {
    setIsLoginForm((value) => !value);
    setError("");
  };

  return (
    <div className="app-bg flex items-center justify-center px-4 py-10">
      <div className="app-card w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              {isLoginForm ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {isLoginForm
                ? "Sign in to continue to DevConnect"
                : "Join the developer community"}
            </p>
          </div>

          {!isLoginForm && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="app-label" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  className="app-input"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="app-label" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  className="app-input"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="app-label" htmlFor="emailId">
              Email
            </label>
            <input
              id="emailId"
              type="email"
              value={emailId}
              className="app-input"
              placeholder="you@example.com"
              onChange={(e) => setEmailId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="app-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              className="app-input"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/30">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full border-none bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : isLoginForm ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-slate-400">
            {isLoginForm ? "New user?" : "Already have an account?"}{" "}
            <button type="button" className="app-link" onClick={toggleForm}>
              {isLoginForm ? "Sign up here" : "Login here"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
