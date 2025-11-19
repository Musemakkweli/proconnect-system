// Overwritten to force the login-only layout
import React from "react";
import LoginBox from "../components/LoginBox";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <LoginBox />
    </div>
  );
}