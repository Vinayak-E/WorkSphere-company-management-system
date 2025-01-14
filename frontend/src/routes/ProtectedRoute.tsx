import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); 
  console.log("user",user);
  console.log(allowedRoles,"allowedRoles")
  

  if (!user?.role) {

    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
  
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
