import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DocumentProcessor from '../components/DocumentProcessor';
import DocumentAnalisys from '../components/DocumentAnalisys';
import { AnalysisProvider } from '../context/AnalysisContext';

const AppRoutes = () => {
  return (
    <AnalysisProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DocumentProcessor />} />
          <Route path="/analisys" element={<DocumentAnalisys />} />
        </Routes>
      </Router>
    </AnalysisProvider>
  );
};

export default AppRoutes;
