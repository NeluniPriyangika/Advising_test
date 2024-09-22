import React from 'react';
import { useLogout } from '../logOut/LogOut';

const AdvisorHome = () => {
  const logout = useLogout();

  return (
    <div>
      <h1>Welcome to Advisor Home</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default AdvisorHome;