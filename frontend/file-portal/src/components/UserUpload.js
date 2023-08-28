import React, { useState } from "react";
import axios from "axios";

function UserUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  console.log(file);

  const storedUser = localStorage.getItem('userDetails');
  const user = JSON.stringify(storedUser);
  if (!user) {
    console.error("No userDetails available.");
    return;
  } else {
    console.log(`inside upload: ${user}`);
  }

  const handleFileUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    try {
      await axios.post("http://localhost:8000/api/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `JWT ${token}`,
        },
      });
      setUploadStatus("File uploaded successfully.");
      window.location.replace("/upload");
    } catch (err) {
      setUploadStatus("Error uploading file.");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-form">
        <h2>Upload File</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>Upload</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
}

export default UserUpload;
