import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import LoadingSpinner from "./LoadingSpinner";

const Profile = () => {
  const user = useSelector((store) => store.user);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};
export default Profile;
