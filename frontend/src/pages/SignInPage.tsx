import { SignIn } from "@clerk/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
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
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <img
            src="/goverment.png"
            alt="JanSahay"
            className="mx-auto h-12 w-12 rounded-full object-cover shadow-sm"
          />
          <h1 className="mt-3 text-2xl font-bold text-[var(--ink)]">
            JanSahay Sign In & Access
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Use instant guest access or sign in with Google
          </p>
        </div>

        {/* Dummy Credentials & Guest Access Card (Always Visible) */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-white p-6 shadow-xl dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg dark:bg-emerald-950">
              🔑
            </span>
            <div>
              <h2 className="text-base font-bold text-[var(--ink)]">
                Dummy Credentials / Guest Access
              </h2>
              <p className="text-xs text-[var(--muted)]">
                No Google account required — instant access
              </p>
            </div>
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
            <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] dark:bg-zinc-900">
              Or
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickGuest}
            className="w-full rounded-xl border border-emerald-300 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-800 transition-all hover:bg-emerald-100 active:scale-[0.99] dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          >
            ⚡ Continue as Guest (Instant Access)
          </button>
        </div>

        {/* Google / Account Sign In */}
        <div className="rounded-2xl border border-[var(--hairline)] bg-white p-6 shadow-xl dark:bg-zinc-900">
          <h2 className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Or Sign In with Google
          </h2>
          <div className="flex justify-center">
            <SignIn routing="path" path="/sign-in" />
          </div>
        </div>
      </div>
    </div>
  );
}
