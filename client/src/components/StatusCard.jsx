import React from 'react';

function StatusCard({ apiData }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>Backend Connection Status:</h3>
      <p><strong>Status:</strong> {apiData ? apiData.status : 'Loading...'}</p>
      <p><strong>Message:</strong> {apiData ? apiData.message : 'Connecting to API...'}</p>
    </div>
  );
}

export default StatusCard;