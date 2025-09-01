import React, { useState, useContext } from "react";
import { extractTextsFromAPI, sendToN8nWebhook } from "../services/api";
import "../css/DocumentProcessor.css";
import ErrorModal from "./ErrorModal";
import useErrorModal from "./useErrorModal";
import LoadingModal from "./LoadingModal";
import { AnalysisContext } from "../context/AnalysisContext";

const DocumentProcessor = () => {
  const [formData, setFormData] = useState({
    email: "",
    analysisType: "",
    files: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileStatus, setFileStatus] = useState(
    "No se han seleccionado archivos.",
  );
  const [isDragging, setIsDragging] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { error, showError, hideError } = useErrorModal();
  const { setAnalysisResult } = useContext(AnalysisContext);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Por favor ingresa un email válido.");
      } else {
        setEmailError("");
      }
    }
  };

  // Función para manejar selección de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: files,
    }));

    if (files.length === 0) {
      setFileStatus("No se han seleccionado archivos.");
    } else if (files.length === 1) {
      setFileStatus(files[0].name);
    } else {
      setFileStatus(`${files.length} archivos seleccionados`);
    }
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
    setFormData((prev) => ({
      ...prev,
      files: files,
    }));

    if (files.length === 0) {
      setFileStatus("No se han seleccionado archivos.");
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
      setAnalysisResult(null);

      console.log("Extrayendo textos de documentos...");
      const extractedData = await extractTextsFromAPI(formData.files);

      console.log("Enviando datos al webhook...");
      const webhookResult = await sendToN8nWebhook(
        formData.email,
        formData.analysisType,
        extractedData,
      );
      console.log("Proceso completado:", webhookResult);
      setAnalysisResult(webhookResult);
      setIsSuccess(true);

      // Limpiar formulario
      setFormData({
        email: "",
        analysisType: "",
        files: [],
      });
      setFileStatus("No se han seleccionado archivos.");

      // Limpiar el input de archivos
      const fileInput = document.getElementById("documents");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error en el proceso:", error);
      showError(
        "server",
        `En este momento no es posible procesar los documentos. Por favor intenta más tarde.`,
      );
      setIsLoading(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    // Validaciones
    if (!formData.email || !validateEmail(formData.email)) {
      showError("email-invalid");
      return;
    }

    if (!formData.analysisType) {
      showError("validation", "Por favor selecciona el tipo de análisis");
      return;
    }

    if (formData.files.length === 0) {
      showError("file-upload", "Por favor selecciona al menos un documento");
      return;
    }

    // Validar tipos de archivo permitidos
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    for (let file of formData.files) {
      if (!allowedTypes.includes(file.type)) {
        showError("file-type", `Tipo de archivo no permitido: ${file.name}`);
        return;
      }
    }

    processDocuments();
  };

  const handleNewAnalysis = () => {
    setIsLoading(false);
    setIsSuccess(false);
  };

  return (
    <div className="DocumentProcessor_container">
      <LoadingModal
        isOpen={isLoading}
        isSuccess={isSuccess}
        onNewAnalysis={handleNewAnalysis}
      />
      <ErrorModal
        isOpen={error.isOpen}
        onClose={hideError}
        errorType={error.type}
        customMessage={error.message}
      />
      <div className="form-container">
        <h1 className="title">Análisis de Documentos</h1>
        <div className="logo-container">
          <img src="/3.png" alt="logo blackpool" className="logo" />
          <img src="/Oracle-Logo-1.png" alt="logo oracle" className="logo" />
        </div>

        <p className="subtitle">
          Adjunta los documentos que requieras analizar y define el análisis que
          quieres recibir.
        </p>

        <div>
          {/* Campo Email */}
          <div className="form-group">
            <label className="label">
              Ingresa el correo donde quieres recibir el informe{" "}
              <span className="required">*</span>
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
              className={`file-drop-zone ${isDragging ? "dragover" : ""}`}
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
                <svg
                  className="file-icon"
                  width="50"
                  height="43"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z"
                    fill="#A78BFA"
                  />
                  <path
                    d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                    fill="#A78BFA"
                  />
                </svg>
                <span>
                  Arrastra y suelta archivos aquí, o haz clic para seleccionar
                  archivos
                </span>
                <span className="file-status">{fileStatus}</span>
              </label>
            </div>
          </div>

          {/* Campo Tipo de Análisis */}
          <div className="form-group">
            <label className="label">
              ¿Qué análisis deseas realizar de los documentos?
            </label>
            <select
              name="analysisType"
              value={formData.analysisType}
              onChange={handleInputChange}
              required
              className="select"
            >
              <option value="">Selecciona una opción...</option>
              <option value="Aprobación de credito">
                Aprobación de credito
              </option>
              <option value="Análisis de postulación a cargo">
                Análisis de postulación a cargo
              </option>
              <option value="Aprobación seguro de vida">
                Aprobación seguro de vida
              </option>
            </select>
          </div>

          {/* Botón Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !!emailError}
            className="button"
          >
            Analizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentProcessor;
