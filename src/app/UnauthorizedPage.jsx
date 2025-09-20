const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="text-center p-8 bg-base-100 rounded-2xl shadow-2xl max-w-sm w-full">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <span className="text-6xl text-error" role="img" aria-label="Lock icon">
            🔒
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-neutral mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-neutral mb-6">
          You do not have permission to view this page.
        </p>

        {/* Action Button */}
        <a href="/" className="btn btn-primary btn-wide rounded-full text-lg">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
