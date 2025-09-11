import React, { useContext } from "react";
import { AnalysisContext } from "../context/AnalysisContext";
import { useNavigate } from "react-router-dom";
import "../css/DocumentAnalisys.css";

const DocumentAnalisys = () => {
  const { analysisResult } = useContext(AnalysisContext);
  const navigate = useNavigate();

  // Función para determinar el estado basado en palabras clave
  const getStatusClass = (estado) => {
    if (!estado) return "docAnalysis-statusNeutral";

    const estadoLower = estado.toLowerCase();

    // Estados POSITIVOS
    const positiveKeywords = [
      "apto",
      "válido",
      "valido",
      "consistente",
      "aprobado",
      "sin antecedentes",
      "pagar seguro",
      "viable",
      "aplica"
    ];

    // Estados NEGATIVOS
    const negativeKeywords = [
      "no apto",
      "no válido",
      "no valido",
      "inconsistente",
      "no aprobado",
      "con antecedentes",
      "no pagar seguro",
      "no viable",
      "no aplica",
    ];

    // Verificar estados negativos primero (más específicos)
    if (negativeKeywords.some((keyword) => estadoLower.includes(keyword))) {
      return "docAnalysis-statusNegative";
    }

    // Luego verificar estados positivos
    if (positiveKeywords.some((keyword) => estadoLower.includes(keyword))) {
      return "docAnalysis-statusPositive";
    }

    // Por defecto, neutral
    return "docAnalysis-statusNeutral";
  };

  // Función para determinar si el resultado general es positivo o negativo
  const getResultClass = (estado) => {
    if (!estado) return "docAnalysis-creditResultApproved";

    const estadoLower = estado.toLowerCase();
    const negativeStates = [
      "no apto",
      "no aprobado",
      "rechazado",
      "denegado",
      "con antecedentes",
      "no pagar seguro",
      "no viable",
      "no aplica",
    ];

    return negativeStates.some((negative) => estadoLower.includes(negative))
      ? "docAnalysis-creditResultDenied"
      : "docAnalysis-creditResultApproved";
  };

  // Función para obtener el icono apropiado
  const getStatusIcon = (estado) => {
    const statusClass = getStatusClass(estado);

    if (statusClass === "docAnalysis-statusNegative") {
      return (
        <svg
          className="docAnalysis-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ marginRight: "0.5rem" }}
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else if (statusClass === "docAnalysis-statusPositive") {
      return (
        <svg
          className="docAnalysis-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ marginRight: "0.5rem" }}
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <svg
          className="docAnalysis-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ marginRight: "0.5rem" }}
        >
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  // Verificación más robusta de los datos
  if (!analysisResult) {
    return (
      <div className="docAnalysis-container">
        <div className="docAnalysis-header">
          <div className="docAnalysis-headerContent">
            <div className="docAnalysis-headerIcon">
              <svg
                className="docAnalysis-iconXl"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="docAnalysis-headerTitle">Análisis de Estudio</h1>
            <p className="docAnalysis-headerSubtitle">
              No hay datos de análisis para mostrar. Por favor, realiza un nuevo
              análisis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Determinar si analysisResult es un array o un objeto
  let analysis;
  if (Array.isArray(analysisResult)) {
    if (analysisResult.length === 0) {
      return (
        <div className="docAnalysis-container">
          <div className="docAnalysis-header">
            <div className="docAnalysis-headerContent">
              <div className="docAnalysis-headerIcon">
                <svg
                  className="docAnalysis-iconXl"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="docAnalysis-headerTitle">Sin Datos</h1>
              <p className="docAnalysis-headerSubtitle">
                No hay datos de análisis para mostrar.
              </p>
            </div>
          </div>
        </div>
      );
    }
    analysis = analysisResult[0];
  } else {
    analysis = analysisResult;
  }

  // Verificar que el objeto analysis existe y tiene las propiedades esperadas
  if (!analysis || typeof analysis !== "object") {
    return (
      <div className="docAnalysis-container">
        <div className="docAnalysis-header">
          <div className="docAnalysis-headerContent">
            <div className="docAnalysis-headerIcon">
              <svg
                className="docAnalysis-iconXl"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="docAnalysis-headerTitle">Error de Formato</h1>
            <p className="docAnalysis-headerSubtitle">
              Los datos de análisis no tienen el formato correcto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    Banco,
    Datos_personales,
    Criterios,
    Analisis_crediticio,
    Resultado,
  } = analysis;

  return (
    <div className="docAnalysis-container">
      {/* Header */}
      <div className="docAnalysis-header">
        <div className="docAnalysis-headerContent">
          <div className="logo-container">
            <img src="/3.png" alt="logo blackpool" className="logo" />
            <img src="/Oracle-Logo-1.png" alt="logo oracle" className="logo" />
          </div>
          <h1 className="docAnalysis-headerTitle">Análisis de viabilidad crediticio</h1>
        </div>
      </div>

      {/* Resultado del Estudio de Crédito */}
      {Resultado && (
        <div
          className={`docAnalysis-creditResult ${getResultClass(Resultado.Estado)}`}
        >
          <div className="docAnalysis-resultHeader">
            
            <h2 className="docAnalysis-resultTitle">Resultado del Estudio</h2>
            <div
              className={`docAnalysis-resultStatus ${getResultClass(Resultado.Estado) === "docAnalysis-creditResultDenied" ? "docAnalysis-resultStatusDenied" : "docAnalysis-resultStatusApproved"}`}
            >
              {Resultado.Estado || "No especificado"}
            </div>
          </div>

          <div className="docAnalysis-resultDetails">
            <h3 className="docAnalysis-resultDetailsTitle">
              Detalles del Análisis
            </h3>
            <p className="docAnalysis-resultDetailsText">
              {Resultado.Motivos || "No se proporcionaron detalles adicionales."}
            </p>
          </div>
        </div>
      )}

      {/* Datos Personales */}
      {Datos_personales && typeof Datos_personales === "object" && (
        <div className="docAnalysis-card">
          <h3 className="docAnalysis-cardTitle">
            <svg
              className="docAnalysis-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Datos Personales
          </h3>
          <div className="docAnalysis-personalDataGrid">
            {Object.entries(Datos_personales).map(([key, value]) => (
              <div key={key} className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="docAnalysis-dataValue">
                  {value || "No especificado"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información del Banco */}
      {Banco && (
        <div className="docAnalysis-card">
          <h3 className="docAnalysis-cardTitle">
            <svg
              className="docAnalysis-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm10 10a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            Entidad Bancaria
          </h3>
          <p className="docAnalysis-bankDescription">Entidad/es bancanrias a las que es viable el credito</p>
          <div className="docAnalysis-bankInfo">
            {Banco}
          </div>
        </div>
      )}

      {/* Criterios de Evaluación */}
      {Criterios && Array.isArray(Criterios) && (
        <>
          <h2 className="docAnalysis-sectionTitle">Criterios de Evaluación</h2>
          <div className="docAnalysis-documentsGrid">
            {Criterios.map((criterio, index) => (
              <div key={index} className="docAnalysis-documentCard">
                <div className="docAnalysis-documentHeader">
                  <div className="docAnalysis-documentTitle">
                    <svg
                      className="docAnalysis-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {criterio.Criterio || "Criterio"}
                  </div>
                </div>

                <div
                  className={`docAnalysis-statusBadge ${getStatusClass(criterio.Estado)}`}
                >
                  {getStatusIcon(criterio.Estado)}
                  {criterio.Estado || "N/A"}
                </div>

                <div className="docAnalysis-documentObservations">
                  {criterio.Observaciones || "Sin observaciones"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Análisis Crediticio */}
      {Analisis_crediticio && (
        <div className="docAnalysis-card">
          <h3 className="docAnalysis-cardTitle">
            <svg
              className="docAnalysis-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Análisis Crediticio
          </h3>
          
          {/* Tarjetas de Crédito */}
          <div className="docAnalysis-creditSection">
            <h4 className="docAnalysis-creditSubtitle">Tarjetas de Crédito</h4>
            <div className="docAnalysis-creditGrid">
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Cantidad</div>
                <div className="docAnalysis-dataValue">{Analisis_crediticio.Tarjetas_credito.Cantidad}</div>
              </div>
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Cupo Total</div>
                <div className="docAnalysis-dataValue">
                  ${Analisis_crediticio.Tarjetas_credito.Cupo_total.toLocaleString()}
                </div>
              </div>
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Cuotas Total</div>
                <div className="docAnalysis-dataValue">
                  ${Analisis_crediticio.Tarjetas_credito.Cuotas_total.toLocaleString()}
                </div>
              </div>
            </div>
            {Analisis_crediticio.Tarjetas_credito.Detalle?.length > 0 && (
              <div className="docAnalysis-detailList">
                <h5>Detalle de Tarjetas:</h5>
                <div className="docAnalysis-detailTable">
                  <table>
                    <thead>
                      <tr>
                        <th>Creditor</th>
                        <th>Límite de Crédito</th>
                        <th>Términos</th>
                        <th>ECOA</th>
                        <th>Cuota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Analisis_crediticio.Tarjetas_credito.Detalle.map((tarjeta, index) => (
                        <tr key={index}>
                          <td>{tarjeta.Creditor}</td>
                          <td>${tarjeta.High_Credit_or_Limit?.toLocaleString()}</td>
                          <td>{tarjeta.Terms}</td>
                          <td>{tarjeta.ECOA}</td>
                          <td>${tarjeta.Cuota?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Otros Créditos */}
          <div className="docAnalysis-creditSection">
            <h4 className="docAnalysis-creditSubtitle">Otros Créditos</h4>
            <p className="docAnalysis-creditDescription">Créditos diferentes a tarjetas de crédito</p>
            <div className="docAnalysis-creditGrid">
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Total Bancolombia</div>
                <div className="docAnalysis-dataValue">
                  ${Analisis_crediticio.Otros_creditos.Total_Bancolombia?.toLocaleString()}
                </div>
              </div>
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Total Davivienda</div>
                <div className="docAnalysis-dataValue">
                  ${Analisis_crediticio.Otros_creditos.Total_Davivienda?.toLocaleString()}
                </div>
              </div>
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Cuentas Compartidas</div>
                <div className="docAnalysis-dataValue">
                  {Analisis_crediticio.Otros_creditos.Cuentas_compartidas}
                </div>
              </div>
            </div>
            {Analisis_crediticio.Otros_creditos.Detalle?.length > 0 && (
              <div className="docAnalysis-detailList">
                <h5>Detalle de Otros Créditos:</h5>
                <div className="docAnalysis-detailTable">
                  <table>
                    <thead>
                      <tr>
                        <th>Creditor</th>
                        <th>Balance</th>
                        <th>ECOA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Analisis_crediticio.Otros_creditos.Detalle.map((credito, index) => (
                        <tr key={index}>
                          <td>{credito.Creditor}</td>
                          <td>${credito.Balance?.toLocaleString()}</td>
                          <td>{credito.ECOA}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón para volver */}
      <button className="docAnalysis-backButton" onClick={() => navigate("/")}>
        ← Nuevo Análisis
      </button>
    </div>
  );
};

export default DocumentAnalisys;
