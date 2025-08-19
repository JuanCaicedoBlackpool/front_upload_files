import React, { useState } from 'react';
import { extractTextsFromAPI, sendToN8nWebhook } from '../services/api';
import './DocumentProcessor.css';

const DocumentProcessor = () => {
  const [formData, setFormData] = useState({
    email: '',
    analysisType: '',
    files: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState('No se han seleccionado archivos.');
  const [useProductionUrl, setUseProductionUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [emailError, setEmailError] = useState('');

 const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};


  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Por favor ingresa un email válido.');
      } else {
        setEmailError('');
      }
    }
  };

  // Función para manejar selección de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: files
    }));

    if (files.length === 0) {
      setFileStatus('No se han seleccionado archivos.');
    } else if (files.length === 1) {
      setFileStatus(files[0].name);
    } else {
      setFileStatus(`${files.length} archivos seleccionados`);
    }
  };

  const handleCheckboxChange = (e) => {
    setUseProductionUrl(e.target.checked);
  };

  // Funciones para manejar el drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setFormData(prev => ({
        ...prev,
        files: files
    }));

    if (files.length === 0) {
        setFileStatus('No se han seleccionado archivos.');
    } else if (files.length === 1) {
        setFileStatus(files[0].name);
    } else {
        setFileStatus(`${files.length} archivos seleccionados`);
    }
  };

  // Función principal que procesa los documentos
  const processDocuments = async () => {
    try {
      setIsLoading(true);
      
      console.log('Extrayendo textos de documentos...');
      const extractedData = await extractTextsFromAPI(formData.files);
      
      console.log('Enviando datos al webhook...');
      const webhookResult = await sendToN8nWebhook(formData.email, formData.analysisType, extractedData, useProductionUrl);
      console.log('Proceso completado:', webhookResult);
      alert('¡Documentos procesados exitosamente! Recibirás el análisis en tu correo.');
      
      
      // Limpiar formulario
      setFormData({
        email: '',
        analysisType: '',
        files: []
      });
      setFileStatus('No se han seleccionado archivos.');
      
      // Limpiar el input de archivos
      const fileInput = document.getElementById('documents');
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Error en el proceso:', error);
      alert(`Error al procesar documentos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    // Validaciones
    if (!formData.email || !validateEmail(formData.email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!formData.analysisType) {
      alert('Por favor selecciona el tipo de análisis');
      return;
    }

    if (formData.files.length === 0) {
      alert('Por favor selecciona al menos un documento');
      return;
    }

    // Validar tipos de archivo permitidos
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    for (let file of formData.files) {
      if (!allowedTypes.includes(file.type)) {
        alert(`Tipo de archivo no permitido: ${file.name}`);
        return;
      }
    }

    processDocuments();
  };

  return (
    <div className="container">
      <div className="form-container">
        
        <h1 className="title">
          Análisis de Documentos
        </h1>
        
        <p className="subtitle">
          Adjunta los documentos que requieras analizar y define el análisis que quieres recibir.
        </p>
        
        <div>
          
          {/* Campo Email */}
          <div className="form-group">
            <label className="label">
              Ingresa el correo donde quieres recibir el informe <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu-email@ejemplo.com"
              required
              className="input"
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          {/* Campo Archivos */}
          <div className="form-group">
            <label className="label">
              Adjunta los documentos que quieres analizar
            </label>
            <div 
              className={`file-drop-zone ${isDragging ? 'dragover' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="documents"
                multiple
                accept=".pdf,.docx,.txt,.xlsx,.xls,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden-input"
              />
              <label htmlFor="documents" className="file-label-content">
                <svg className="file-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path fill="#A78BFA" d="M48.4 26.5c-.8 0-1.5.7-1.5 1.5v9c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-9c0-.8-.7-1.5-1.5-1.5S0 27.2 0 28v9c0 2.8 2.2 5 5 5h40c2.8 0 5-2.2 5-5v-9c0-.8-.7-1.5-1.6-1.5z"/><path fill="#A78BFA" d="M24.2 1.5c-.4-.4-1-.4-1.4 0L11.3 13c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l10.8-10.8v28.9c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V3.6l10.8 10.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L24.2 1.5z"/></svg>
                <span>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos</span>
                <span className="file-status">{fileStatus}</span>
              </label>
            </div>
          </div>

          {/* Campo Tipo de Análisis */}
          <div className="form-group">
            <label className="label">
              Qué análisis deseas realizar de los documentos
            </label>
            <select
              name="analysisType"
              value={formData.analysisType}
              onChange={handleInputChange}
              required
              className="select"
            >
              <option value="">Selecciona una opción...</option>
              <option value="Aprobación de credito">Aprobación de credito</option>
              <option value="Validación hoja de vida">Validación hoja de vida</option>
              <option value="Validación general">Validación general</option>

            </select>
          </div>

          {/* Production URL Checkbox */}
          <div className="form-group">
            <label className="label">
              <input
                type="checkbox"
                checked={useProductionUrl}
                onChange={handleCheckboxChange}
              />
              Usar URL de producción
            </label>
          </div>

          {/* Botón Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !!emailError}
            className="button"
          >
            {isLoading ? 'Procesando...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentProcessor;