import React from 'react';
import '../css/DocumentAnalisys.css';

const DocumentAnalysis = () => {
    return (
        <>
            {/* Header */}
            <div className="header">
                <div className="DocumentAnalysis_container">
                    <div className="header-content">
                        <div className="header-icon">
                            <svg className="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10,9 9,9 8,9"></polyline>
                            </svg>
                        </div>
                        <h1>Análisis de Documentos</h1>
                        <p>Resultado completo del estudio crediticio y evaluación documental</p>
                    </div>
                </div>
            </div>

            <div className="DocumentAnalysis_container">
                {/* Datos Personales */}
                <div className="card">
                    <h2 className="card-title">
                        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Datos del Solicitante
                    </h2>
                    <div className="personal-data-grid">
                        <div className="data-field">
                            <p className="data-label">Nombres</p>
                            <p className="data-value">David Alejandro</p>
                        </div>
                        <div className="data-field">
                            <p className="data-label">Apellidos</p>
                            <p className="data-value">Londoño Pardo</p>
                        </div>
                        <div className="data-field">
                            <p className="data-label">Identificación</p>
                            <p className="data-value">14.696.144</p>
                        </div>
                        <div className="data-field">
                            <p className="data-label">Género</p>
                            <p className="data-value">Masculino</p>
                        </div>
                    </div>
                </div>

                {/* Análisis Documental */}
                <h2 className="section-title">Resumen de Análisis Documental</h2>
                <div className="documents-grid">
                    <div className="document-card">
                        <div className="document-header">
                            <div className="document-title">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                                </svg>
                                <h3>Cédula de ciudadanía</h3>
                            </div>
                        </div>
                        <div className="status-badge status-valid">VÁLIDO</div>
                        <p className="document-observations">
                            Documento vigente y coherente con los demás. Fecha de expedición 20-DIC-2000, sin fecha de vencimiento indicada.
                        </p>
                    </div>

                    <div className="document-card">
                        <div className="document-header">
                            <div className="document-title">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                                </svg>
                                <h3>Colillas de pago</h3>
                            </div>
                        </div>
                        <div className="status-badge status-valid">CONSISTENTE</div>
                        <p className="document-observations">
                            Ingresos netos de $3.590.000 (después de deducciones) durante mayo, junio y julio de 2025. Coherentes en montos y fechas recientes.
                        </p>
                    </div>

                    <div className="document-card">
                        <div className="document-header">
                            <div className="document-title">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <h3>Carta de contador</h3>
                            </div>
                        </div>
                        <div className="status-badge status-inconsistent">INCONSISTENTE</div>
                        <p className="document-observations">
                            Certifica ingresos promedio de $7.500.000, lo cual contradice las colillas de pago ($4.200.000 básicos). Fecha de emisión reciente (14 de julio de 2025).
                        </p>
                    </div>

                    <div className="document-card">
                        <div className="document-header">
                            <div className="document-title">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                                </svg>
                                <h3>Carta laboral</h3>
                            </div>
                        </div>
                        <div className="status-badge status-valid">CONSISTENTE</div>
                        <p className="document-observations">
                            Confirma salario básico de $4.200.000 y antigüedad laboral desde marzo de 2021. Coherente con colillas de pago.
                        </p>
                    </div>

                    <div className="document-card">
                        <div className="document-header">
                            <div className="document-title">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                                </svg>
                                <h3>Escritura pública de inmueble</h3>
                            </div>
                        </div>
                        <div className="status-badge status-valid">VÁLIDO</div>
                        <p className="document-observations">
                            Propiedad en Cali (Carrera 45 #12-34) adquirida en enero de 2023. Matrícula inmobiliaria clara y coherente con la identidad del solicitante.
                        </p>
                    </div>

                    <div className="document-card">
                        <div className="document-header">
                            <div className="document-title">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                                </svg>
                                <h3>Reporte de scoring crediticio</h3>
                            </div>
                        </div>
                        <div className="status-badge status-valid">VÁLIDO</div>
                        <p className="document-observations">
                            Puntaje de 720 (riesgo bajo). Capacidad de endeudamiento simulada de $120.000.000. Sin reportes negativos.
                        </p>
                    </div>
                </div>

                {/* Resultado del Crédito */}
                <div className="credit-result denied">
                    <div className="result-header">
                        <div className="result-icon denied">
                            <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <h2 className="result-title">Resultado de Evaluación</h2>
                        <div className="result-status denied">CRÉDITO NO APROBADO</div>
                    </div>
                    
                    <div className="result-details">
                        <h3>Motivos de la Decisión:</h3>
                        <p>
                            Los ingresos comprobados mediante colillas de pago ($4.200.000 básicos / $3.590.000 netos) están por debajo del mínimo requerido de $5.000.000. Además, existe una inconsistencia grave entre la carta del contador ($7.500.000) y los documentos laborales/colillas. Aunque el solicitante cuenta con un inmueble como respaldo y un scoring crediticio favorable, la falta de capacidad de pago comprobada y las contradicciones en los ingresos impiden la aprobación del crédito.
                        </p>
                    </div>
                </div>

                {/* Recomendaciones */}
                <div className="recommendations">
                    <h3>
                        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Recomendaciones
                    </h3>
                    <div className="recommendation-list">
                        <div className="recommendation-item">
                            <div className="recommendation-bullet"></div>
                            <p className="recommendation-text">Revisar y corregir las inconsistencias en la documentación de ingresos presentada</p>
                        </div>
                        <div className="recommendation-item">
                            <div className="recommendation-bullet"></div>
                            <p className="recommendation-text">Su scoring crediticio es excelente - mantener este buen historial crediticio</p>
                        </div>
                        <div className="recommendation-item">
                            <div className="recommendation-bullet"></div>
                            <p className="recommendation-text">Considerar solicitar un monto de crédito acorde a su capacidad de pago actual demostrada</p>
                        </div>
                        <div className="recommendation-item">
                            <div className="recommendation-bullet"></div>
                            <p className="recommendation-text">Podrá aplicar nuevamente una vez cumplidos los requisitos mínimos de ingresos</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    <div className="footer-card">
                        <h3>BANCO OCI-ORACLE</h3>
                        <div className="footer-contacts">
                            <div className="contact-item">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <span>(601) 123-4567</span>
                            </div>
                            <div className="contact-item">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <span>creditos@oci-oracle.com</span>
                            </div>
                        </div>
                        <p className="footer-note">
                            Análisis generado automáticamente • Confidencial
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentAnalysis;