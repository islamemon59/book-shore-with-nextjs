import DesktopLottie from "../login/Components/DesktopLottie/DesktopLottie";
import RegisterForm from "./Components/RegisterForm/RegisterForm";
import Link from "next/link"; // Use Next.js Link for client-side navigation

export const generateMetadata = () => {
  return {
    title: "BookShore | Register",
  };
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 min-h-screen bg-base-100 p-8 md:p-12">
      {/* Lottie Animation - Desktop Only */}
      <div className="hidden lg:block">
        <DesktopLottie />
      </div>

      {/* Form Container */}
      <div className="w-full lg:w-1/2 max-w-lg bg-base-200 shadow-2xl rounded-3xl p-8 md:p-12 transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold text-primary text-center tracking-tight animate-fade-in-down">
          Create Account ✨
        </h1>
        <p className="text-center text-lg text-neutral mt-3 font-light animate-fade-in-up">
          Join BookShore and start your reading journey
        </p>

        <div className="mt-8">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-neutral mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}