import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addConnections } from "../utils/conectionSlice";
import LoadingSpinner from "./LoadingSpinner";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!connections);

  const fetchConnections = async () => {
    const isInitialLoad = connections === null;
    if (isInitialLoad) setIsLoading(true);
    setError("");
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch {
      setError("Failed to load connections. Please try again.");
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error && !connections) {
    return (
      <div className="app-bg flex flex-col items-center gap-4 px-4 py-10">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={fetchConnections}>
          Try again
        </button>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="app-bg flex flex-col items-center gap-4 px-4 py-10 text-center">
        <h1 className="page-title">No connections yet</h1>
        <p className="page-subtitle max-w-md">
          Browse the feed to find developers and send connection requests.
        </p>
        <Link to="/" className="btn btn-primary btn-sm">
          Go to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="app-bg px-4 py-10">
      <h1 className="page-title mb-8 text-center">Connections</h1>

      <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection;

        return (
          <div
            key={_id}
            className="panel-card flex items-start gap-4"
          >
            <div className="shrink-0">
              <img
                alt={`${firstName} ${lastName}`}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10"
                src={photoUrl}
              />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <h2 className="text-xl font-bold text-white">
                {firstName} {lastName}
              </h2>
              {age && gender && (
                <p className="text-sm text-slate-400">
                  {age}, {gender}
                </p>
              )}
              <p className="mt-1 break-words text-slate-300">{about}</p>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
export default Connections;
