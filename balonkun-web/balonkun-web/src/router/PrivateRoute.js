import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isLogin, children }) => {
  if (isLogin) {
    return children;
  }
  return <Navigate to='/' />;
};

export default PrivateRoute;
