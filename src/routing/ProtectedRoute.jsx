import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Show unauthorized screen if no user is found in redux store
  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-3xl font-bold text-center mb-4">Unauthorized :(</h1>
          <p className="text-lg mb-4">You need to login to gain access.</p>
          <NavLink to="/login" className="text-blue-600 hover:underline">
            Login
          </NavLink>
          <span className="ml-2">to gain access</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
