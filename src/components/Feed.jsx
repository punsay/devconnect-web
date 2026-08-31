import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";
import SwipeableUserCard from "./SwipeableUserCard";
import LoadingSpinner from "./LoadingSpinner";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!feed);

  const getFeed = async () => {
    if (feed) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch {
      setError("Failed to load feed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="app-bg flex flex-col items-center gap-4 px-4 py-10">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={getFeed}>
          Try again
        </button>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="app-bg flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-3xl bg-slate-900/60 px-8 py-10 ring-1 ring-white/10 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white">No new users found</h1>
          <p className="mt-2 max-w-md text-slate-300">
            Check back later or update your profile to help others find you.
          </p>
          <Link to="/profile" className="btn btn-primary btn-sm mt-6">
            Edit profile
          </Link>
        </div>
      </div>
    );
  }

  const nextUser = feed[1];

  return (
    <div className="app-bg flex flex-col items-center px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Discover
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Swipe right if interested, left to pass
        </p>
      </div>

      <div className="relative w-full max-w-sm">
        {nextUser && (
          <div
            className="pointer-events-none absolute inset-x-0 top-3 z-0 scale-[0.96] opacity-40"
            aria-hidden="true"
          >
            <UserCard user={nextUser} showActions={false} />
          </div>
        )}
        <div className="relative z-10">
          <SwipeableUserCard key={feed[0]._id} user={feed[0]} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          git revert
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          git merge
        </span>
      </div>
    </div>
  );
};
export default Feed;
