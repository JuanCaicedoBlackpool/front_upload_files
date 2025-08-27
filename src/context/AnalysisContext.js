import React, { createContext, useState, useMemo } from 'react';

export const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
    const [analysisResult, setAnalysisResult] = useState(null);

    const value = useMemo(() => ({ analysisResult, setAnalysisResult }), [analysisResult]);

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
};
