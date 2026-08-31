import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL, PROFILE_ABOUT_MAX_LENGTH } from "../utils/constants";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(
    (user.about || "").slice(0, PROFILE_ABOUT_MAX_LENGTH)
  );
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async () => {
    setError("");
    if (about.length > PROFILE_ABOUT_MAX_LENGTH) {
      setError(`About must be ${PROFILE_ABOUT_MAX_LENGTH} characters or less.`);
      return;
    }
    setIsSaving(true);
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Failed to save profile. Please try again.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSaving) saveProfile();
  };

  return (
    <>
      <form
        className="app-bg flex flex-col items-start justify-center gap-8 px-4 py-10 lg:flex-row"
        onSubmit={handleSubmit}
      >
        <div className="app-card w-full max-w-md">
          <div className="space-y-4">
            <h2 className="text-center text-2xl font-bold text-white">
              Edit Profile
            </h2>
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
              />
            </div>
            <div>
              <label className="app-label" htmlFor="photoUrl">
                Photo URL
              </label>
              <input
                id="photoUrl"
                type="url"
                value={photoUrl}
                className="app-input"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="app-label" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                min="18"
                value={age}
                className="app-input"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="app-label" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                className="app-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="app-label mb-0" htmlFor="about">
                  About
                </label>
                <span
                  className={`text-xs ${
                    about.length > PROFILE_ABOUT_MAX_LENGTH
                      ? "text-rose-400"
                      : "text-slate-500"
                  }`}
                >
                  {about.length}/{PROFILE_ABOUT_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="about"
                value={about}
                maxLength={PROFILE_ABOUT_MAX_LENGTH}
                className="app-input min-h-24 resize-y"
                onChange={(e) => setAbout(e.target.value)}
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
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col items-center lg:w-auto">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Profile Preview
          </h2>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about }}
            showActions={false}
          />
        </div>
      </form>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;
