import React, { useContext } from "react";
import { AnalysisContext } from "../utils/AnalysisContext";
import { useNavigate } from "react-router-dom";
import "../css/DocumentAnalisys.css";

const DocumentAnalisys = () => {
  const { analysisResult } = useContext(AnalysisContext);
  const navigate = useNavigate();

  // --- Validation Functions ---

  const checkNameConsistency = (cedula, preclasificacion) => {
    return cedula?.nombre?.trim() === preclasificacion?.nombre?.trim();
  };

  const checkIdConsistency = (cedula, preclasificacion) => {
    return cedula?.identificacion === preclasificacion?.identificacion_cc;
  };

  const checkSocialSecurity = (preclasificacion) => {
    return preclasificacion?.social_security && preclasificacion.social_security.trim() !== '';
  };

  const checkCreditType = (preclasificacion) => {
    return preclasificacion?.credito_hipotecario === "True";
  };

  const checkFamilyExpenses = (preclasificacion) => {
    const salario = parseFloat(preclasificacion?.salario_mensual);
    const gastos = parseFloat(preclasificacion?.gastos_familiares);
    if (isNaN(salario) || isNaN(gastos) || salario === 0) return false;
    return (gastos / salario) <= 0.5;
  };

  const checkCreditScore = (reporte) => {
    const score = parseInt(reporte?.score, 10);
    if (isNaN(score)) return { bancolombia: false, davivienda: false };
    return {
      bancolombia: score >= 600,
      davivienda: score >= 700,
    };
  };

  const checkChargeOff = (reporte) => {
    if (!reporte) return false;
    const chargeOff = parseInt(reporte.charge_off, 10);
    return chargeOff === 0;
  };

  const checkCollections = (reporte) => {
    if (!reporte) return false;
    const collections = parseInt(reporte.collections, 10);
    return collections === 0;
  };

  // --- Helper Functions for UI ---

  const formatName = (name) => {
    if (!name) return "No especificado";
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusClass = (isValid) => {
    if (isValid === true) return "docAnalysis-statusPositive";
    if (isValid === false) return "docAnalysis-statusNegative";
    return "docAnalysis-statusNeutral";
  };

  const getStatusIcon = (isValid) => {
    const statusClass = getStatusClass(isValid);
    if (statusClass === "docAnalysis-statusNegative") {
      return <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    }
    if (statusClass === "docAnalysis-statusPositive") {
      return <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
    return <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  };

  if (!analysisResult || Object.keys(analysisResult).length === 0) {
    return (
      <div className="docAnalysis-container">
        <div className="docAnalysis-header">
          <h1 className="docAnalysis-headerTitle">Análisis de Estudio</h1>
          <p className="docAnalysis-headerSubtitle">No hay datos de análisis para mostrar.</p>
        </div>
      </div>
    );
  }

  const { "Cedula": cedula, "Formato preclasificacion": preclasificacion, "Reporte credito": reporteCredito } = analysisResult;

  // --- Perform Validations ---
  const isNameConsistent = checkNameConsistency(cedula, preclasificacion);
  const isIdConsistent = checkIdConsistency(cedula, preclasificacion);
  const hasSocialSecurity = checkSocialSecurity(preclasificacion);
  const isMortgageCredit = checkCreditType(preclasificacion);
  const areExpensesValid = checkFamilyExpenses(preclasificacion);
  const scoreValidation = checkCreditScore(reporteCredito);
  const hasNoChargeOff = checkChargeOff(reporteCredito);
  const hasNoCollections = checkCollections(reporteCredito);

  const isScoreValid = scoreValidation.bancolombia || scoreValidation.davivienda;
  let scoreObs = `Score: ${reporteCredito?.score || 'N/A'}. `;
  const validBanks = [];
  if (scoreValidation.bancolombia) validBanks.push("Bancolombia");
  if (scoreValidation.davivienda) validBanks.push("Davivienda");

  if (validBanks.length > 0) {
    scoreObs += `Válido para ${validBanks.join(', ')}.`;
  } else {
    scoreObs += 'No cumple el mínimo para ninguna entidad.';
  }

  const evaluationCriteria = [
    { Criterio: "Coherencia de nombres", Estado: isNameConsistent, Observaciones: isNameConsistent ? "Nombres coinciden" : "Nombres no coinciden" },
    { Criterio: "Coherencia de cédula", Estado: isIdConsistent, Observaciones: isIdConsistent ? "Cédulas coinciden" : "Cédulas no coinciden" },
    { Criterio: "Presencia de Social Security", Estado: hasSocialSecurity, Observaciones: hasSocialSecurity ? "SSN presente" : "SSN ausente" },
    { Criterio: "Tipo de crédito", Estado: isMortgageCredit, Observaciones: isMortgageCredit ? "Crédito Hipotecario" : "No es Crédito Hipotecario" },
    { Criterio: "Gastos familiares", Estado: areExpensesValid, Observaciones: areExpensesValid ? "Gastos familiares ≤ 50% del salario" : "Gastos familiares ≥ 50% del salario" },
    { Criterio: "Score crediticio", Estado: isScoreValid, Observaciones: scoreObs },
    { Criterio: "Charge Off", Estado: hasNoChargeOff, Observaciones: hasNoChargeOff ? "Sin Charge Off" : `Presenta Charge Off: ${reporteCredito?.charge_off}` },
    { Criterio: "Collections", Estado: hasNoCollections, Observaciones: hasNoCollections ? "Sin Collections" : `Presenta Collections: ${reporteCredito?.collections}` },
  ];

  const overallResult = evaluationCriteria.every(c => c.Estado);

  // --- Procesamiento de Datos para Análisis Crediticio ---
  const tarjetasDeCredito = reporteCredito?.open_accounts?.filter(
    acc => acc.acct_type === 'REV' || acc.acct_type === 'OPEN'
  ) || [];

  const otrosCreditos = reporteCredito?.open_accounts?.filter(
    acc => acc.acct_type !== 'REV' && acc.acct_type !== 'OPEN'
  ) || [];

  // Cálculos para Tarjetas de Crédito
  const cupoTotalTarjetas = tarjetasDeCredito.reduce((sum, tarjeta) => {
    const limit = parseFloat(tarjeta.high_score_limit) || 0;
    return sum + (tarjeta.ecoa === 'J' ? limit / 2 : limit);
  }, 0);
  const cuotasTotalTarjetas = tarjetasDeCredito.reduce((sum, tarjeta) => {
    const terms = parseFloat(tarjeta.terms) || 0;
    return sum + (tarjeta.ecoa === 'J' ? terms / 2 : terms);
  }, 0);

  // Cálculos para Otros Créditos
  const totalOtrosCreditos = otrosCreditos.reduce((sum, credito) => {
    const terms = parseFloat(credito.terms) || 0;
    return sum + terms;
  }, 0);
  const totalCompartidosOtrosCreditos = otrosCreditos
    .filter(c => c.ecoa === 'J')
    .reduce((sum, credito) => {
      const terms = parseFloat(credito.terms) || 0;
      return sum + terms;
    }, 0);


  return (
    <div className="docAnalysis-container">
      <div className="docAnalysis-header">
        <div className="docAnalysis-headerContent">
          <div className="logo-container">
            <img src="/3.png" alt="logo blackpool" className="logo" />
            <img src="/Oracle-Logo-1.png" alt="logo oracle" className="logo" />
          </div>
          <h1 className="docAnalysis-headerTitle">Análisis de viabilidad crediticio</h1>
        </div>
      </div>

      <div className={`docAnalysis-creditResult ${overallResult ? "docAnalysis-creditResultApproved" : "docAnalysis-creditResultDenied"}`}>
        <div className="docAnalysis-resultHeader">
          <h2 className="docAnalysis-resultTitle">Resultado del Estudio</h2>
          <div className={`docAnalysis-resultStatus ${!overallResult ? "docAnalysis-resultStatusDenied" : "docAnalysis-resultStatusApproved"}`}>
            {overallResult ? "Aprobado" : "Rechazado"}
          </div>
          <p className="docAnalysis-resultDescription">
            {overallResult
              ? "¡Felicidades! El estudio de crédito ha sido aprobado. El cliente cumple con todos los criterios de evaluación."
              : "El estudio de crédito ha sido rechazado. El cliente no cumple con uno o más de los criterios de evaluación. Por favor revise los detalles a continuación."}
          </p>
        </div>
      </div>

      {cedula && (
        <div className="docAnalysis-card">
          <h3 className="docAnalysis-cardTitle">Datos Personales</h3>
          <div className="docAnalysis-personalDataGrid">
            <div className="docAnalysis-dataField">
              <div className="docAnalysis-dataLabel">Nombre</div>
              <div className="docAnalysis-dataValue">{formatName(cedula.nombre)}</div>
            </div>
            <div className="docAnalysis-dataField">
              <div className="docAnalysis-dataLabel">Identificación</div>
              <div className="docAnalysis-dataValue">{cedula.identificacion || "No especificado"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Información del Banco */}
      {overallResult && validBanks.length > 0 && (
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
          <p className="docAnalysis-bankDescription">Entidad/es bancarias a las que es viable el credito</p>
          <div className="docAnalysis-bankInfo">
            {validBanks.join(', ')}
          </div>
        </div>
      )}

      <h2 className="docAnalysis-sectionTitle">Criterios de Evaluación</h2>
      <div className="docAnalysis-documentsGrid">
        {evaluationCriteria.map((criterio, index) => (
          <div key={index} className="docAnalysis-documentCard">
            <div className="docAnalysis-documentHeader">
              <div className="docAnalysis-documentTitle">
                {criterio.Criterio}
              </div>
            </div>
            <div className={`docAnalysis-statusBadge ${getStatusClass(criterio.Estado)}`}>
              {getStatusIcon(criterio.Estado)}
              {criterio.Estado ? "Cumple" : "No Cumple"}
            </div>
            <div className="docAnalysis-documentObservations">
              {criterio.Observaciones}
            </div>
          </div>
        ))}
      </div>

      {/* Análisis Crediticio */}
      {reporteCredito && reporteCredito.open_accounts && (
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
                <div className="docAnalysis-dataValue">{tarjetasDeCredito.length}</div>
              </div>
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Cupo Total</div>
                <div className="docAnalysis-dataValue">
                  ${cupoTotalTarjetas.toLocaleString()}
                </div>
              </div>
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Cuotas Total</div>
                <div className="docAnalysis-dataValue">
                  ${cuotasTotalTarjetas.toLocaleString()}
                </div>
              </div>
            </div>
            {tarjetasDeCredito.length > 0 && (
              <div className="docAnalysis-detailList">
                <h5>Detalle de Tarjetas:</h5>
                <div className="docAnalysis-detailTable">
                  <table>
                    <thead>
                      <tr>
                        <th>Creditor</th>
                        <th>Límite de Crédito</th>
                        <th>Cuota</th>
                        <th>ECOA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tarjetasDeCredito.map((tarjeta, index) => (
                        <tr key={index}>
                          <td>{tarjeta.creditor}</td>
                          <td>${tarjeta.high_score_limit?.toLocaleString()}</td>
                          <td>${tarjeta.terms?.toLocaleString()}</td>
                          <td>{tarjeta.ecoa}</td>
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
                <div className="docAnalysis-dataLabel">Cuota Total</div>
                <div className="docAnalysis-dataValue">
                  ${totalOtrosCreditos.toLocaleString()}
                </div>
              </div>
              <div className="docAnalysis-dataField">
                <div className="docAnalysis-dataLabel">Cuota Compartida</div>
                <div className="docAnalysis-dataValue">
                  ${totalCompartidosOtrosCreditos.toLocaleString()}
                </div>
              </div>
            </div>
            {otrosCreditos.length > 0 && (
              <div className="docAnalysis-detailList">
                <h5>Detalle de Otros Créditos:</h5>
                <div className="docAnalysis-detailTable">
                  <table>
                    <thead>
                      <tr>
                        <th>Creditor</th>
                        <th>Balance</th>
                        <th>Cuota</th>
                        <th>ECOA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otrosCreditos.map((credito, index) => (
                        <tr key={index}>
                          <td>{credito.creditor}</td>
                          <td>${credito.high_score_limit?.toLocaleString()}</td>
                          <td>${credito.terms?.toLocaleString()}</td>
                          <td>{credito.ecoa}</td>
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

      <button className="docAnalysis-backButton" onClick={() => navigate("/")}>
        ← Nuevo Análisis
      </button>
    </div>
  );
};

export default DocumentAnalisys;
