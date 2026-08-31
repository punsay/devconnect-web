import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed, restoreUserToFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const SWIPE_THRESHOLD = 100;
const EXIT_DISTANCE = 600;

const SwipeableUserCard = ({ user }) => {
  const { _id } = user;
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState("");

  const rotation = offset.x * 0.08;
  const ignoreOpacity = Math.min(Math.max(-offset.x / SWIPE_THRESHOLD, 0), 1);
  const interestedOpacity = Math.min(Math.max(offset.x / SWIPE_THRESHOLD, 0), 1);

  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsAnimating(false);
    setError("");
  }, [_id]);

  const sendRequest = async (status) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
    } catch {
      dispatch(restoreUserToFeed(user));
      setError("Failed to send request. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const animateExit = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const exitX = direction === "right" ? EXIT_DISTANCE : -EXIT_DISTANCE;
    setOffset({ x: exitX, y: offset.y });
    const status = direction === "right" ? "interested" : "ignored";
    window.setTimeout(() => {
      dispatch(removeUserFromFeed(_id));
      sendRequest(status);
    }, 280);
  };

  const handlePointerDown = (event) => {
    if (isAnimating) return;
    if (event.target.closest("[data-no-swipe]")) return;
    cardRef.current?.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || isAnimating) return;
    setOffset({
      x: event.clientX - dragStart.current.x,
      y: (event.clientY - dragStart.current.y) * 0.4,
    });
  };

  const handlePointerUp = () => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);

    if (offset.x > SWIPE_THRESHOLD) {
      animateExit("right");
    } else if (offset.x < -SWIPE_THRESHOLD) {
      animateExit("left");
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const cardStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
    transition: isDragging ? "none" : "transform 0.28s ease-out",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: 10,
  };

  return (
    <>
      {error && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className="relative w-full"
        style={cardStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
          {ignoreOpacity > 0.05 && (
            <div
              className="pointer-events-none absolute left-5 top-8 z-20 rotate-[-10deg] rounded-lg border-2 border-rose-400 px-4 py-2 text-lg font-semibold text-rose-400"
              style={{ opacity: ignoreOpacity }}
            >
              Pass
            </div>
          )}
          {interestedOpacity > 0.05 && (
            <div
              className="pointer-events-none absolute right-5 top-8 z-20 rotate-[10deg] rounded-lg border-2 border-emerald-400 px-4 py-2 text-lg font-semibold text-emerald-400"
              style={{ opacity: interestedOpacity }}
            >
              Interested
            </div>
          )}

        <UserCard
          user={user}
          actionsDisabled={isAnimating}
          onIgnore={() => animateExit("left")}
          onInterested={() => animateExit("right")}
        />
      </div>
    </>
  );
};

export default SwipeableUserCard;
