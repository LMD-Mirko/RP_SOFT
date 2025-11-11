import React, { useMemo, useState } from 'react';
import { GeminiContext } from './gemini';

export function GeminiProvider({ children }) {
  const [model, setModel] = useState('gemini-1.5-pro');
  const [temperature, setTemperature] = useState(0.4);
  const [showAgentIntegrator, setShowAgentIntegrator] = useState(false);

  const value = useMemo(() => ({ 
    model, 
    setModel, 
    temperature, 
    setTemperature, 
    showAgentIntegrator, 
    setShowAgentIntegrator 
  }), [model, temperature, showAgentIntegrator]);

  return <GeminiContext.Provider value={value}>{children}</GeminiContext.Provider>;
}