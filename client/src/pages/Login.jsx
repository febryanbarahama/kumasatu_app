import React, { useState } from "react";
import { useAuth } from "../contexts/authContexts.jsx";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // untuk animasi loading
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = "Username wajib diisi";
    if (!form.password.trim()) errors.password = "Password wajib diisi";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validate()) return;

    setLoading(true); // mulai loading

    try {
      await login(form);
      // animasi loading singkat sekitar 1.5 detik
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setLoading(false);
      const apiMsg = err.response?.data?.message || "Login gagal";
      if (apiMsg.toLowerCase().includes("username")) {
        setValidationErrors((prev) => ({
          ...prev,
          username: apiMsg,
        }));
      } else if (apiMsg.toLowerCase().includes("password")) {
        setValidationErrors((prev) => ({
          ...prev,
          password: apiMsg,
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          general: apiMsg,
        }));
      }
    }
  };

  const renderInput = (
    id,
    type,
    value,
    onChange,
    label,
    errorText,
    isPassword
  ) => (
    <div className="relative">
      <input
        id={id}
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        className={`peer block w-full rounded border px-3 pt-5 pb-2 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all
          ${errorText ? "border-red-500" : "border-gray-300"}
        `}
        placeholder=" "
        autoComplete="off"
        disabled={loading}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 text-gray-500 transition-all px-1
          bg-white pointer-events-none
          ${
            value
              ? "text-sm -top-2 text-blue-600"
              : "top-4 text-base text-gray-400"
          }
          peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-600
        `}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[22px] text-xl text-blue-600 hover:text-blue-800"
          disabled={loading}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      )}

      {errorText && <p className="mt-1 text-sm text-red-600">{errorText}</p>}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <div
        className="flex-1 hidden bg-center bg-cover md:flex"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')`,
        }}
        aria-hidden="true"
      ></div>

      <div className="flex items-center justify-center flex-1 p-6 bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <img
              src="../src/assets/logo.png"
              alt="Logo Kampung"
              className="w-auto h-14"
            />
          </div>

          <h2 className="mb-6 text-3xl font-semibold text-center text-blue-700">
            Masuk
          </h2>

          {validationErrors.general && (
            <div className="px-4 py-2 mb-4 text-center text-red-700 bg-red-100 border border-red-300 rounded">
              {validationErrors.general}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            {renderInput(
              "username",
              "text",
              form.username,
              (e) => setForm({ ...form, username: e.target.value }),
              "Username",
              validationErrors.username,
              false
            )}

            {renderInput(
              "password",
              "password",
              form.password,
              (e) => setForm({ ...form, password: e.target.value }),
              "Password",
              validationErrors.password,
              true
            )}

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 mx-auto text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
