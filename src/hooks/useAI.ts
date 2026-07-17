import { useState, useCallback } from 'react';
import { APIError } from '../api/client';

/**
 * Basic loading state hook
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [statusMessage, setStatusMessage] = useState('');

  const startLoading = useCallback((msg = '') => {
    setIsLoading(true);
    setStatusMessage(msg);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setStatusMessage('');
  }, []);

  return { isLoading, statusMessage, startLoading, stopLoading, setStatusMessage };
}

/**
 * Reusable hook for making unified AI requests with loading, success, failure, and retry handling
 */
export function useAIRequest<T, Args extends any[]>(
  apiFn: (...args: Args) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err: any) {
      const friendlyMessage = err instanceof APIError ? err.message : (err.message || 'An error occurred during execution.');
      setError(friendlyMessage);
      if (options.onError) {
        options.onError(friendlyMessage);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, execute, reset, setData };
}

/**
 * specialized hook for managing PDF Ingestion pipeline states and logs
 */
export function usePDFProcessing() {
  const [step, setStep] = useState<'idle' | 'uploading' | 'extracting' | 'chunking' | 'indexing' | 'summarizing' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  const startProcessing = useCallback(() => {
    setStep('uploading');
    setProgress(10);
    setLogs([]);
    setError(null);
    addLog('Initiating document ingestion pipeline...');
  }, [addLog]);

  const setExtracting = useCallback((title: string) => {
    setStep('extracting');
    setProgress(35);
    addLog(`Extracting full text content from: "${title}"`);
  }, [addLog]);

  const setChunking = useCallback((chunksCount: number) => {
    setStep('chunking');
    setProgress(60);
    addLog(`Running DocumentProcessor pipeline: splitted into ${chunksCount} overlapping semantic chunks.`);
  }, [addLog]);

  const setSummarizing = useCallback(() => {
    setStep('summarizing');
    setProgress(85);
    addLog('Querying unified AIService: synthesizing multi-dimensional summaries, keywords, methodology and findings...');
  }, [addLog]);

  const setSuccess = useCallback((title: string) => {
    setStep('success');
    setProgress(100);
    addLog(`Ingestion successful! Processed document indexed and saved: "${title}"`);
  }, [addLog]);

  const setFailed = useCallback((message: string) => {
    setStep('failed');
    setError(message);
    addLog(`Pipeline failed: ${message}`);
  }, [addLog]);

  const resetPipeline = useCallback(() => {
    setStep('idle');
    setProgress(0);
    setLogs([]);
    setError(null);
  }, []);

  return {
    step,
    progress,
    logs,
    error,
    startProcessing,
    setExtracting,
    setChunking,
    setSummarizing,
    setSuccess,
    setFailed,
    resetPipeline
  };
}
