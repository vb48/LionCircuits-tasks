// UserProfileEdit.js
import React, { useState } from 'react';
import axios from 'axios';

const UserProfileEdit = ({ initialName, initialAddresses, initialPhoneNumber, onClose}) => {
  const [newName, setNewName] = useState(initialName);
  const [newAddresses, setNewAddresses] = useState(initialAddresses);
  const [newPhoneNumber, setNewPhoneNumber] = useState(initialPhoneNumber);
  const [updateStatus, setUpdateStatus] = useState('');

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token available.');
        return;
      }

      console.log(`printing initial data: ${initialName},${initialAddresses},${initialPhoneNumber}`)

      const updatedData = {
        name: newName,
        addresses: newAddresses,
        phoneNumber: newPhoneNumber,
      };
      console.log(updatedData)
      await axios.put('http://localhost:8000/api/user-profile', updatedData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setUpdateStatus('updated user profile successfully.');
    } catch (error) {
      setUpdateStatus('Error updating user profile:');
    }
  };

  return (
    <div className="user-profile-edit">
      <h2>Edit User Profile</h2>
      <label>
        Name:
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
      </label>
      <label>
        Addresses:
        <textarea value={newAddresses} onChange={(e) => setNewAddresses(e.target.value)} />
      </label>
      <label>
        Phone Number:
        <input type="text" value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save</button>
      {updateStatus && <p>{updateStatus}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UserProfileEdit;
