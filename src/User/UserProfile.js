import React, { useEffect, useState } from 'react';
import Api from '../Api';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await Api.get('/blogs/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("imm",res);
      setUser(res.data);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Profile;
