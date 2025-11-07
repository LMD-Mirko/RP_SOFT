import React, { createContext, useContext, useMemo, useState } from 'react'


const GeminiContext = createContext()


export function GeminiProvider({ children }) {
const [model, setModel] = useState('gemini-1.5-pro')
const [temperature, setTemperature] = useState(0.4)


const value = useMemo(() => ({ model, setModel, temperature, setTemperature }), [model, temperature])


return <GeminiContext.Provider value={value}>{children}</GeminiContext.Provider>
}


export function useGemini() { return useContext(GeminiContext) }