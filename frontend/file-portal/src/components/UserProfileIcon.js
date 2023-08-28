import React, { useState } from 'react';
import UserProfileScreen from './UserProfileScreen';
import userImage from '../assets/images/page icon.png'

function UserProfileIcon() {
  const [showProfile, setShowProfile] = useState(false);

  const storedUser = localStorage.getItem('userDetails');
  console.log(`storedUser storedUser: ${storedUser}`);
  const user = JSON.parse(storedUser);
  if (!user) {
    // console.error("No userDetails available.");
    return;
  } else {
    // alert(user.name)
    // console.log(`inside upload: ${user}`);
  }

  return (
    <div>
      <img
        src={userImage}
        alt="User Profile"
        onClick={() => setShowProfile(true)}
        style={{ cursor: 'pointer' }}
      />
      {showProfile && <UserProfileScreen  initialName={user.name}  initialAddresses={user.address} initialPhoneNumber={user.phone} onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default UserProfileIcon;
