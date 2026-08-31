import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!requests);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch {
      setError("Failed to update request. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const fetchRequests = async () => {
    const isInitialLoad = requests === null;
    if (isInitialLoad) setIsLoading(true);
    setError("");
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch {
      setError("Failed to load requests. Please try again.");
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error && !requests) {
    return (
      <div className="app-bg flex flex-col items-center gap-4 px-4 py-10">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchRequests}>
          Try again
        </button>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="app-bg flex flex-col items-center gap-4 px-4 py-10 text-center">
        <h1 className="page-title">No pending requests</h1>
        <p className="page-subtitle max-w-md">
          When someone sends you a connection request, it will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="app-bg px-4 py-10">
      {error && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}
      <h1 className="page-title mb-8 text-center">Connection Requests</h1>

      <div className="mx-auto flex max-w-4xl flex-col gap-4">
      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;

        return (
          <div
            key={_id}
            className="panel-card flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <img
                alt="photo"
                className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10"
                src={photoUrl}
              />
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && (
                  <p className="text-sm text-slate-400">{age + ", " + gender}</p>
                )}
                <p className="mt-1 text-slate-300">{about}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                className="btn btn-outline border-slate-500 text-slate-200 hover:border-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn border-none bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
export default Requests;
