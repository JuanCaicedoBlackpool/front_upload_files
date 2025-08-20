
import React from 'react';

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          .loading-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: rgba(10, 10, 20, 0.6);
            backdrop-filter: blur(4px);
          }

          .loading-modal-container {
            width: 100%;
            max-width: 28rem; /* 448px */
            border-radius: 1.5rem; /* 24px */
            padding: 2.5rem; /* 40px */
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(30, 27, 75, 0.85);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            position: relative;
            z-index: 51;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .loading-spinner {
            width: 3rem; /* 48px */
            height: 3rem; /* 48px */
            border-radius: 50%;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top-color: #a78bfa;
            animation: spin 1s linear infinite;
            margin-bottom: 1.5rem;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-text {
            font-size: 1.25rem; /* 20px */
            font-weight: 500;
            color: #fff;
            text-align: center;
          }
        `}
      </style>
      <div className="loading-modal-overlay">
        <div className="loading-modal-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Analizando documentos</p>
        </div>
      </div>
    </>
  );
};

export default LoadingModal;
