import DesktopLottie from "../login/Components/DesktopLottie/DesktopLottie";
import RegisterForm from "./Components/RegisterForm/RegisterForm";


export default function RegisterPage() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 justify-center min-h-screen bg-base-100 px-4">
      {/* Form Container */}
      <div className="w-full lg:w-1/2 max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-primary">
          Create Account ✨
        </h1>
        <p className="text-center text-sm text-neutral mt-2">
          Join BookShore and start your reading journey
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-neutral mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-secondary hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Lottie Animation - Desktop Only */}
      <DesktopLottie />
    </div>
  );
}
