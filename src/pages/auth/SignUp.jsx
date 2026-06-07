import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    shopName: "",
    profileImage: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.role === "admin") {
        toast.error("Admin accounts cannot be created from signup.");
        return;
      }

      const result = await dispatch(registerUser(formData));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Registered successfully!");
        if (formData.role === "seller") navigate("/seller/profile");
        else navigate("/customer");
      } else {
        toast.error(result.payload || "Registration failed");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4 sm:p-6">
      <div className="backdrop-blur-xl bg-white/20 shadow-2xl border border-white/30 max-w-4xl w-full rounded-3xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-start">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-5 drop-shadow-lg leading-tight">
            Stationery Books System
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-5 sm:mb-6">
            Create your account to get started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-white text-sm sm:text-base font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full p-3 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none shadow-md"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm sm:text-base font-medium mb-1">Email</label>
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
              <label className="text-white text-sm sm:text-base font-medium mb-1">Password</label>
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

            {/* Responsive Role Dropdown */}
            <div className="flex flex-col relative" ref={dropdownRef}>
              <label className="text-white text-sm sm:text-base font-medium mb-1">Select Role</label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full p-3 rounded-xl bg-white/80 text-left flex justify-between items-center focus:ring-2 focus:ring-blue-300 outline-none shadow-md"
              >
                <span>{formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</span>
                {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg max-h-48 overflow-auto">
                  {["customer", "seller"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-100 transition text-gray-700`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {formData.role === "seller" && (
              <>
                <div className="flex flex-col">
                  <label className="text-white text-sm sm:text-base font-medium mb-1">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    placeholder="Enter shop name"
                    className="w-full p-3 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none shadow-md"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-white text-sm sm:text-base font-medium mb-1">Profile Image URL</label>
                  <input
                    type="text"
                    name="profileImage"
                    placeholder="Paste image URL"
                    className="w-full p-3 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-300 outline-none shadow-md"
                    value={formData.profileImage}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {error && <p className="text-red-200 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-base sm:text-lg
                         bg-gradient-to-r from-blue-500 to-indigo-600
                         hover:shadow-2xl transition-all duration-300"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-grow h-px bg-white/40"></div>
            <span className="mx-3 text-white/80 text-sm sm:text-base font-medium">OR</span>
            <div className="flex-grow h-px bg-white/40"></div>
          </div>

          <p className="text-center text-white/80 mt-4 text-sm sm:text-base">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-white underline font-semibold hover:text-gray-200"
            >
              Sign In
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

export default SignUp;
