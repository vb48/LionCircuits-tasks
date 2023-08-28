import React, { useState, useEffect } from "react";
import axios from "axios";

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log(token)
      if (!token) {
        console.error("No token available.");
        return;
      }

      const config = {
        headers: {
        'content-type': 'application/json',
        "Authorization": `Bearer ${token}`,
      }}

      const url = "http://localhost:8000/api/files-list"

      const response = await axios.get(url, config);

      // console.log(response)

      if (response.status ===200) {
        const data = response.data;
        setFiles(data);
      } else {
        console.error("Error fetching files");
      }
    } catch (error) {
      console.error("Error fetching files", error);
    }
  };

  return (
    <>
    <h2>File List</h2>
    <div className="file-list-container">
      <table className="file-list-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Date Uploaded</th>
            <th>File Type</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.file.split('/')[2]}</td>
              <td>{Date(Date.parse(file.upload_date))}</td>
              <td>{file.file_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default FileList;
