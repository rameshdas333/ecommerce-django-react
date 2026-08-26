import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-12">
      
      </div>

      {/* Error Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 sm:pb-28 md:pb-32 text-center">

        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl  font-semibold text-gray-900 tracking-wide">
          {error?.status || "404"} Not Found
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-4 sm:mt-6 max-w-md">
          Your visited page not found. You may go home page.
        </p>

        <Link
          to="/"
          className="mt-8 sm:mt-10 md:mt-12 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded transition duration-300"
        >
          Back to home page
        </Link>

      </div>
    </div>
  );
};

export default ErrorPage;