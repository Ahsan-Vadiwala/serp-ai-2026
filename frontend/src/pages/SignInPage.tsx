import { SignIn } from "@clerk/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"clerk" | "dummy">("dummy");
  const [dummyEmail, setDummyEmail] = useState("demo@jansahay.gov.in");
  const [dummyPassword, setDummyPassword] = useState("demo123");

  const handleDummyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `guest_${Date.now()}`;
    localStorage.setItem("guest_auth_token", token);
    localStorage.setItem("guest_user_name", dummyEmail.split("@")[0] || "Demo User");
    navigate("/chat");
  };

  const handleQuickGuest = () => {
    localStorage.setItem("guest_auth_token", "guest_demo_user");
    localStorage.setItem("guest_user_name", "Guest Citizen");
    navigate("/chat");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--canvas)] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[var(--hairline)] bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <img
            src="/goverment.png"
            alt="JanSahay"
            className="mx-auto h-12 w-12 rounded-full object-cover"
          />
          <h1 className="mt-3 text-2xl font-bold text-[var(--ink)]">
            Welcome to JanSahay
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Choose your preferred sign-in method
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 flex rounded-xl bg-[var(--canvas-secondary)] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("dummy")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              activeTab === "dummy"
                ? "bg-white text-[var(--ink)] shadow dark:bg-zinc-800"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            Dummy / Guest Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("clerk")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              activeTab === "clerk"
                ? "bg-white text-[var(--ink)] shadow dark:bg-zinc-800"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            Google Sign In
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "dummy" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--hairline)] bg-[var(--accent-tint-soft)] p-3 text-xs leading-relaxed text-[var(--body)]">
              <span className="font-semibold text-[var(--ink)]">Demo Mode Active:</span> You can log in directly with dummy credentials or enter as a guest without signing into Google.
            </div>

            <form onSubmit={handleDummyLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Username / Email
                </label>
                <input
                  type="text"
                  value={dummyEmail}
                  onChange={(e) => setDummyEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--hairline)] bg-[var(--canvas)] px-3.5 py-2 text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="demo@jansahay.gov.in"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Password
                </label>
                <input
                  type="password"
                  value={dummyPassword}
                  onChange={(e) => setDummyPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[var(--hairline)] bg-[var(--canvas)] px-3.5 py-2 text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-semibold text-[var(--on-primary)] transition-all hover:opacity-90 active:scale-[0.99]"
              >
                Log In with Dummy Credentials
              </button>
            </form>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--hairline)]" />
              </div>
              <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-[var(--muted)] dark:bg-zinc-900">
                Or
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickGuest}
              className="w-full rounded-xl border border-[var(--hairline)] bg-[var(--canvas-secondary)] py-2.5 text-sm font-semibold text-[var(--ink)] transition-all hover:bg-[var(--canvas)] active:scale-[0.99]"
            >
              ⚡ Continue as Guest (Instant Access)
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <SignIn routing="path" path="/sign-in" />
          </div>
        )}
      </div>
    </div>
  );
}
