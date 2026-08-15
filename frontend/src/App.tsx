import("./App.css")

import React, { useState, type FormEvent } from "react";
import {
  registerUser,
  loginUser,
  getPrivateData,
} from "./components/services/api";

const AuthDashboard: React.FC = () => {
  // Tab Management: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");

  // Registration Form State
  const [regUserName, setRegUserName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regRole, setRegRole] = useState<string>("student");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // System & API States
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || "",
  );
  const [privateMsg, setPrivateMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Registration Logic
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsLoading(true);

    try {
      const res = await registerUser({
        userName: regUserName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });

      if (res.success) {
        setStatusMsg({
          text: res.message || "Registration Successful!",
          isError: false,
        });
        setRegUserName("");
        setRegEmail("");
        setRegPassword("");
        setRegRole("student");
        setActiveTab("login");
      } else {
        setStatusMsg({
          text: res.message || "Registration failed.",
          isError: true,
        });
      }
    } catch {
      setStatusMsg({ text: "Server connection failed.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Login Logic
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsLoading(true);

    try {
      const res = await loginUser({
        email: loginEmail,
        password: loginPassword,
      });

      if (res.success && res.token) {
        setToken(res.token);
        localStorage.setItem("token", res.token);
        setStatusMsg({
          text: res.message || "Login Successful!",
          isError: false,
        });
        setLoginEmail("");
        setLoginPassword("");
      } else {
        setStatusMsg({
          text: res.message || "Invalid credentials.",
          isError: true,
        });
      }
    } catch {
      setStatusMsg({ text: "Server connection failed.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Protected Route Test Logic
  const handleFetchPrivateData = async () => {
    if (!token) return;
    setIsLoading(true);
    setPrivateMsg("");

    try {
      const res = await getPrivateData(token);
      if (typeof res === "string") setPrivateMsg(res);
      else if (res && typeof res === "object" && "message" in res)
        setPrivateMsg(res.message);
      else setPrivateMsg("Access Denied");
    } catch {
      setPrivateMsg("Error fetching private data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Logic
  const handleLogout = () => {
    setToken("");
    setPrivateMsg("");
    localStorage.removeItem("token");
    setStatusMsg({ text: "Logged out successfully.", isError: false });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Auth Portal
          </h1>
          <p className="text-xs text-slate-400">
            JWT Role-Based Access Control System
          </p>
        </div>

        {/* Global Alert Notification */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl font-medium text-xs text-center border transition-all backdrop-blur-md ${
              statusMsg.isError
                ? "bg-red-500/10 border-red-500/30 text-red-300 shadow-lg shadow-red-500/5"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-500/5"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Auth Box Container */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {/* Form Selector Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>
          </div>

          {/* Registration Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  value={regUserName}
                  onChange={(e) => setRegUserName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="management">Management</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Processing..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  placeholder="registered@example.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Authenticating..." : "Login to System"}
              </button>
            </form>
          )}
        </div>

        {/* Active Session & Protected Route Testing Panel */}
        {token && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold uppercase text-slate-300 tracking-wider">
                  Session Active
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer"
              >
                Logout
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                JWT Bearer Token
              </p>
              <p className="text-[11px] font-mono text-indigo-300 break-all line-clamp-2">
                {token}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={handleFetchPrivateData}
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl transition border border-slate-700 disabled:opacity-50 cursor-pointer"
              >
                {isLoading
                  ? "Fetching..."
                  : "Test Protected Route (/privateData)"}
              </button>
              {privateMsg && (
                <div className="mt-3 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-center text-xs text-indigo-200">
                  {privateMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDashboard;
