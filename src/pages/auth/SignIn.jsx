import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showToast = (message, type = "success") => {
    // Only show toast for screens >= 640px (sm)
    if (window.innerWidth >= 640) {
      if (type === "success") toast.success(message);
      else toast.error(message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const actionResult = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(actionResult)) {
        showToast("Logged in successfully!");
        const role = actionResult.payload.role;
        if (role === "admin") navigate("/admin");
        else if (role === "seller") navigate("/seller/profile");
        else navigate("/customer");
      } else {
        showToast(actionResult.payload || "Login failed", "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await dispatch(googleLogin());
      if (res.meta.requestStatus === "fulfilled") {
        showToast("Logged in with Google!");
        const role = res.payload.role;
        if (role === "admin") navigate("/admin");
        else if (role === "seller") navigate("/seller/profile");
        else navigate("/customer");
      } else {
        showToast(res.payload || "Google sign-in failed", "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4 sm:p-6">
      <div className="backdrop-blur-xl bg-white/20 shadow-2xl border border-white/30 max-w-4xl w-full rounded-3xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-start">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-5 drop-shadow-lg leading-tight">
            Stationery Books System
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-5 sm:mb-6">
            Welcome back! Please sign in to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-white text-sm sm:text-base font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none shadow-md"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm sm:text-base font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none shadow-md"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-200 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-base sm:text-lg
                         bg-gradient-to-r from-blue-500 to-indigo-600
                         hover:shadow-2xl transition-all duration-300"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-grow h-px bg-white/40"></div>
            <span className="mx-3 text-white/80 text-sm sm:text-base font-medium">OR</span>
            <div className="flex-grow h-px bg-white/40"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 
                       bg-white text-gray-700 py-3 rounded-xl font-semibold 
                       border border-gray-300 shadow-md hover:shadow-xl 
                       transition-all duration-300 text-sm sm:text-base"
          >
            <img src="/images/google-logo.png" alt="Google" className="w-5 h-5 sm:w-6 sm:h-6" />
            Continue with Google
          </button>

          <p className="text-center text-white/80 mt-5 text-sm sm:text-base">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-white underline font-semibold hover:text-gray-200"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Books"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
