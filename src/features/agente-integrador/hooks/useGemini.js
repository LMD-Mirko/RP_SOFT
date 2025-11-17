import { useContext } from 'react';
import { GeminiContext } from '../context/gemini';

export function useGemini() {
  return useContext(GeminiContext);
}