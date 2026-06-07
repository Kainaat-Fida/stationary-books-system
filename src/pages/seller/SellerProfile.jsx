import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSellerProfile } from "../../features/seller/sellerSlice";
import EditProfile from "./EditProfile";
import { Pencil } from "lucide-react";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile } = useSelector(state => state.seller) || {};
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchSellerProfile(user.uid));
    }
  }, [dispatch, user?.uid]);

  if (!profile) return <p>Loading...</p>; // optional loading

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl max-w-4xl mx-auto my-6 sm:my-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Your Profile</h2>
        <button
          onClick={() => setShowEdit(true)}
          className="p-2 sm:p-3 rounded-full bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white transition"
          title="Edit profile"
        >
          <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
            <img
              src={profile.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-3 w-full text-center sm:text-left">
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            <span className="font-semibold">Name:</span> {profile.name || "-"}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 break-all">
            <span className="font-semibold">Email:</span> {profile.email || "-"}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            <span className="font-semibold">Shop Name:</span> {profile.shopName || "-"}
          </p>
        </div>
      </div>

      {showEdit && <EditProfile profile={profile} userId={user?.uid} closeModal={() => setShowEdit(false)} />}
    </div>
  );
};

export default SellerProfile;
