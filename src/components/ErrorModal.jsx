import React from 'react';
import '../css/ErrorModal.css'; // Importar el archivo CSS

const ErrorModal = ({ isOpen, onClose, errorType, customMessage }) => {
  const isSuccess = errorType === 'success';

  const errorMessages = {
    'file-upload': 'Error al subir los archivos. Verifica que los archivos sean válidos y no excedan el tamaño permitido.',
    'email-invalid': 'El correo electrónico ingresado no es válido. Por favor, verifica e intenta nuevamente.',
    'network': 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
    'server': 'Error del servidor. Por favor, intenta nuevamente en unos momentos.',
    'validation': 'Por favor, completa todos los campos requeridos antes de continuar.',
    'file-type': 'Tipo de archivo no permitido. Solo se aceptan documentos: PDF, Word, TXT, Excel, JPG y PNG.',
    'file-size': 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.',
    'default': 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
    'success': '¡Todo salió bien!'
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    return errorMessages[errorType] || errorMessages['default'];
  };

  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal-backdrop" onClick={onClose}></div>
      
      <div className="error-modal-container">
        <div className={`icon-container ${isSuccess ? 'success-icon-container' : 'error-icon-container'}`}>
          {isSuccess ? (
            <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>

        <h3 className="error-title"> {isSuccess ? '¡Éxito!' : 'Algo no se ve bien'} </h3>
        <p className="error-message-modal">{getMessage()}</p>
        
        <button onClick={onClose} className="error-button">
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;