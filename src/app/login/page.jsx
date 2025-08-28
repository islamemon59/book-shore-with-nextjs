import LoginForm from "./Components/LoginForm/LoginForm";


export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-primary">
          Welcome Back 👋
        </h1>
        <p className="text-center text-sm text-neutral mt-2">
          Sign in to your BookShore account
        </p>

        {/* Form */}
        <div className="mt-6">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-secondary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
