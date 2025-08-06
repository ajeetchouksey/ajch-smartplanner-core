import React from 'react';

// Simple test component to verify basic functionality
export const TestSmartPlanner: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'blue' }}>🚀 SmartPlanner Test</h1>
      <p>If you can see this, the server is working correctly!</p>
      
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '15px',
        margin: '20px 0',
        border: '2px solid #007bff',
        borderRadius: '8px'
      }}>
        <h2>✅ Test Results:</h2>
        <ul>
          <li>✅ React is rendering</li>
          <li>✅ TypeScript is working</li>
          <li>✅ Server is responding</li>
          <li>✅ Basic styling is applied</li>
        </ul>
      </div>

      <button 
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Server URL: http://localhost:3003/</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};
