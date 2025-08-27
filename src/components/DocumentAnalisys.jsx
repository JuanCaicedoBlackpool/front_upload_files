import React, { useContext } from 'react';
import { AnalysisContext } from '../context/AnalysisContext';
import { useNavigate } from 'react-router-dom';
import '../css/DocumentAnalisys.css';

const DocumentAnalisys = () => {
    const { analysisResult } = useContext(AnalysisContext);
    const navigate = useNavigate();

    // Función para determinar el estado basado en palabras clave
    const getStatusClass = (estado) => {
        if (!estado) return 'docAnalysis-statusNeutral';
        
        const estadoLower = estado.toLowerCase();
        
        // Estados POSITIVOS
        const positiveKeywords = [
            'apto', 'válido', 'valido', 'consistente', 'aprobado', 
            'sin antecedentes', 'pagar seguro'
        ];
        
        // Estados NEGATIVOS  
        const negativeKeywords = [
            'no apto', 'no válido', 'no valido', 'inconsistente', 'no aprobado',
            'con antecedentes', 'no pagar seguro'
        ];
        
        // Verificar estados negativos primero (más específicos)
        if (negativeKeywords.some(keyword => estadoLower.includes(keyword))) {
            return 'docAnalysis-statusNegative';
        }
        
        // Luego verificar estados positivos
        if (positiveKeywords.some(keyword => estadoLower.includes(keyword))) {
            return 'docAnalysis-statusPositive';
        }
        
        // Por defecto, neutral
        return 'docAnalysis-statusNeutral';
    };

    // Función para determinar si el resultado general es positivo o negativo
    const getResultClass = (estado) => {
        if (!estado) return 'docAnalysis-creditResultApproved';
        
        const estadoLower = estado.toLowerCase();
        const negativeStates = ['no apto', 'no aprobado', 'rechazado', 'denegado', 'con antecedentes', 'no pagar seguro'];
        
        return negativeStates.some(negative => estadoLower.includes(negative)) 
            ? 'docAnalysis-creditResultDenied' 
            : 'docAnalysis-creditResultApproved';
    };

    // Función para obtener el icono apropiado
    const getStatusIcon = (estado) => {
        const statusClass = getStatusClass(estado);
        
        if (statusClass === 'docAnalysis-statusNegative') {
            return (
                <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '0.5rem'}}>
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        } else if (statusClass === 'docAnalysis-statusPositive') {
            return (
                <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '0.5rem'}}>
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        } else {
            return (
                <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '0.5rem'}}>
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
                            <svg className="docAnalysis-iconXl" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="docAnalysis-headerTitle">Análisis de Estudio</h1>
                        <p className="docAnalysis-headerSubtitle">No hay datos de análisis para mostrar. Por favor, realiza un nuevo análisis.</p>
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
                                <svg className="docAnalysis-iconXl" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h1 className="docAnalysis-headerTitle">Sin Datos</h1>
                            <p className="docAnalysis-headerSubtitle">No hay datos de análisis para mostrar.</p>
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
    if (!analysis || typeof analysis !== 'object') {
        return (
            <div className="docAnalysis-container">
                <div className="docAnalysis-header">
                    <div className="docAnalysis-headerContent">
                        <div className="docAnalysis-headerIcon">
                            <svg className="docAnalysis-iconXl" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="docAnalysis-headerTitle">Error de Formato</h1>
                        <p className="docAnalysis-headerSubtitle">Los datos de análisis no tienen el formato correcto.</p>
                    </div>
                </div>
            </div>
        );
    }

    const {
        titulo,
        Datos_personales,
        Resumen_analisis_documental,
        Resultado_estudio_credito,
        Resultado
    } = analysis;

    // Usar Resultado si existe, sino Resultado_estudio_credito
    const creditResult = Resultado || Resultado_estudio_credito;

    return (
        <div className="docAnalysis-container">
            {/* Header */}
            <div className="docAnalysis-header">
                <div className="docAnalysis-headerContent">
                    <div className="docAnalysis-headerIcon">
                        <svg className="docAnalysis-iconXl" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="docAnalysis-headerTitle">
                        {titulo || 'Análisis'}
                    </h1>
                    <p className="docAnalysis-headerSubtitle">
                        Resultados del procesamiento y análisis de documentos
                    </p>
                </div>
            </div>

             {/* Resultado del Estudio de Crédito */}
            {creditResult && typeof creditResult === 'object' && (
                <div className={`docAnalysis-creditResult ${getResultClass(creditResult.Estado)}`}>
                    <div className="docAnalysis-resultHeader">
                        <div className={`docAnalysis-resultIcon ${getResultClass(creditResult.Estado) === 'docAnalysis-creditResultDenied' ? 'docAnalysis-resultIconDenied' : 'docAnalysis-resultIconApproved'}`}>
                            {getResultClass(creditResult.Estado) === 'docAnalysis-creditResultDenied' ? (
                                <svg className="docAnalysis-iconLg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="docAnalysis-iconLg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <h2 className="docAnalysis-resultTitle">Resultado del Estudio</h2>
                        <div className={`docAnalysis-resultStatus ${getResultClass(creditResult.Estado) === 'docAnalysis-creditResultDenied' ? 'docAnalysis-resultStatusDenied' : 'docAnalysis-resultStatusApproved'}`}>
                            {creditResult.Estado || 'No especificado'}
                        </div>
                    </div>
                    
                    <div className="docAnalysis-resultDetails">
                        <h3 className="docAnalysis-resultDetailsTitle">Detalles del Análisis</h3>
                        <p className="docAnalysis-resultDetailsText">
                            {creditResult.Motivos || 
                             creditResult.Detalles || 
                             creditResult.Observaciones || 
                             'No se proporcionaron detalles adicionales.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Datos Personales */}
            {Datos_personales && typeof Datos_personales === 'object' && (
                <div className="docAnalysis-card">
                    <h3 className="docAnalysis-cardTitle">
                        <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Datos Personales
                    </h3>
                    <div className="docAnalysis-personalDataGrid">
                        {Object.entries(Datos_personales).map(([key, value]) => (
                            <div key={key} className="docAnalysis-dataField">
                                <div className="docAnalysis-dataLabel">
                                    {key.replace(/_/g, ' ')}
                                </div>
                                <div className="docAnalysis-dataValue">
                                    {value || 'No especificado'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resumen Análisis Documental */}
            {Resumen_analisis_documental && Array.isArray(Resumen_analisis_documental) && (
                <>
                    <h2 className="docAnalysis-sectionTitle">Análisis de Documentos</h2>
                    <div className="docAnalysis-documentsGrid">
                        {Resumen_analisis_documental.map((doc, index) => (
                            <div key={index} className="docAnalysis-documentCard">
                                <div className="docAnalysis-documentHeader">
                                    <div className="docAnalysis-documentTitle">
                                        <svg className="docAnalysis-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {doc?.Documento || 'Documento'}
                                    </div>
                                </div>
                                
                                <div className={`docAnalysis-statusBadge ${getStatusClass(doc?.Estado)}`}>
                                    {getStatusIcon(doc?.Estado)}
                                    {doc?.Estado || 'N/A'}
                                </div>
                                
                                <div className="docAnalysis-documentObservations">
                                    {doc?.Observaciones || 'Sin observaciones'}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Botón para volver */}
            <button 
                className="docAnalysis-backButton"
                onClick={() => navigate('/')}
            >
                ← Nuevo Análisis
            </button>
        </div>
    );
};

export default DocumentAnalisys;