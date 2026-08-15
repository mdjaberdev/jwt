import "./App.css";
import React, { useState, type FormEvent } from "react";
import {
  registerUser,
  loginUser,
  getPrivateData,
} from "./components/services/api";

const App: React.FC = () => {
  // Registration Form State
  const [regUserName, setRegUserName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regRole, setRegRole] = useState<string>("student");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // App Logic State
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || "",
  );
  const [privateMsg, setPrivateMsg] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Handle Registration
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await registerUser({
        userName: regUserName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });

      if (res.success) {
        setStatusMsg({
          text: res.message || "Registration Successful! Please Login.",
          isError: false,
        });
        setRegUserName("");
        setRegEmail("");
        setRegPassword("");
      } else {
        setStatusMsg({
          text: res.message || "Registration failed",
          isError: true,
        });
      }
    } catch {
      setStatusMsg({ text: "Server connection failed", isError: true });
    }
  };

  // Handle Login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await loginUser({
        email: loginEmail,
        password: loginPassword,
      });

      if (res.success && res.token) {
        const authToken = res.token;
        setToken(authToken);
        localStorage.setItem("token", authToken);
        setStatusMsg({
          text: res.message || "Login Successful!",
          isError: false,
        });
        setLoginEmail("");
        setLoginPassword("");
      } else {
        setStatusMsg({
          text: res.message || "Login failed. Invalid credentials.",
          isError: true,
        });
      }
    } catch {
      setStatusMsg({ text: "Server connection failed", isError: true });
    }
  };

  // Handle Fetching Private Data
  const handleFetchPrivateData = async () => {
    if (!token) return;
    try {
      const res = await getPrivateData(token);
      if (typeof res === "string") {
        setPrivateMsg(res);
      } else if (res && typeof res === "object" && "message" in res) {
        setPrivateMsg(res.message);
      } else {
        setPrivateMsg("Access Denied");
      }
    } catch {
      setPrivateMsg("Error fetching private data");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setToken("");
    setPrivateMsg("");
    localStorage.removeItem("token");
    setStatusMsg({ text: "Logged out successfully", isError: false });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Auth & Role Permission Dashboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Secure JWT Authentication System
          </p>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div
            className={`p-4 rounded-xl font-medium text-center shadow-lg backdrop-blur-md border transition-all duration-300 ${
              statusMsg.isError
                ? "bg-red-500/10 border-red-500/30 text-red-300 shadow-red-500/5"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-emerald-500/5"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Registration Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/60 hover:border-slate-600 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-sm border border-indigo-500/30">
                  01
                </span>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Registration
                </h2>
              </div>

              <form
                id="regForm"
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={regUserName}
                    onChange={(e) => setRegUserName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="johndoe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="P@ssword123"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100 outline-none cursor-pointer"
                  >
                    <option value="student" className="bg-slate-800 text-white">
                      Student
                    </option>
                    <option value="teacher" className="bg-slate-800 text-white">
                      Teacher
                    </option>
                    <option
                      value="management"
                      className="bg-slate-800 text-white"
                    >
                      Management
                    </option>
                  </select>
                </div>
              </form>
            </div>

            <button
              type="submit"
              form="regForm"
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition duration-200"
            >
              Register Account
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/60 hover:border-slate-600 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm border border-emerald-500/30">
                  02
                </span>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Login
                </h2>
              </div>

              <form id="loginForm" onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="registered@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="Enter your password"
                  />
                </div>
              </form>
            </div>

            <div>
              <button
                type="submit"
                form="loginForm"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition duration-200 mt-6"
              >
                Get Access Token
              </button>

              {token && (
                <div className="mt-5 p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
                      Token Active
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-medium transition"
                    >
                      Clear Token
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-mono break-all line-clamp-2">
                    {token}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Protected Dashboard Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/60 transition duration-300 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-sm border border-purple-500/30">
                03
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Protected Route Test
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Send JWT Token to fetch protected data
                </p>
              </div>
            </div>

            <button
              onClick={handleFetchPrivateData}
              disabled={!token}
              className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition duration-200 active:scale-[0.99] ${
                token
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/25 cursor-pointer"
                  : "bg-slate-700/50 text-slate-500 border border-slate-700 cursor-not-allowed"
              }`}
            >
              Fetch Private Data
            </button>
          </div>

          {privateMsg && (
            <div className="p-5 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Backend Response
              </span>
              <p className="text-purple-200 font-mono text-sm sm:text-base break-words">
                {privateMsg}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
