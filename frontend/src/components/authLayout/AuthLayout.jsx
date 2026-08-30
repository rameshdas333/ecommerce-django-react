import { Outlet } from "react-router-dom";
import authImage from "../../assets/authImage.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE IMAGE */}
        <div className="hidden lg:flex items-center justify-center p-5 xl:p-8">
          <div className="w-full h-[500px] xl:h-[600px]">
            <img
              src={authImage}
              alt="Shopping"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[420px]">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;