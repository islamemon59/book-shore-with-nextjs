import DesktopLottie from "./Components/DesktopLottie/DesktopLottie";
import LoginForm from "./Components/LoginForm/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 justify-center min-h-screen bg-base-100 px-4">
      {/* Form Container */}
      <div className="w-full lg:w-1/2 max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-primary">
          Welcome Back 👋
        </h1>
        <p className="text-center text-sm text-neutral mt-2">
          Sign in to your BookShore account
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-neutral mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-secondary hover:underline">
            Sign up
          </a>
        </p>
      </div>
      {/* Lottie Animation - Desktop Only */}
      <DesktopLottie />
    </div>
  );
}
