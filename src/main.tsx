/// <reference types="vite/client" />

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './ThemeContext.tsx';

// Global API Interceptor supporting custom production backend URL switching and robust error translations
const originalFetch = window.fetch;
const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let targetUrl = input;
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const apiBase = import.meta.env.VITE_API_URL || '';
    targetUrl = apiBase + input;
  } else if (input instanceof URL && input.pathname.startsWith('/api/')) {
    const apiBase = import.meta.env.VITE_API_URL || '';
    if (apiBase) {
      targetUrl = new URL(apiBase + input.pathname + input.search);
    }
  }

  try {
    const response = await originalFetch(targetUrl, init);

    // Proxy the response to override response.json()
    const proxiedResponse = response.clone();
    
    // We override response.json to make it safe against non-JSON text errors!
    response.json = async () => {
      try {
        const text = await proxiedResponse.text();
        try {
          return JSON.parse(text);
        } catch (jsonErr) {
          console.warn("API returned non-JSON content. Status:", response.status, text);
          
          let friendlyMessage = "Serverless function crashed or returned an invalid response.";
          let errCode = "ServerlessFunctionCrashed";
          
          if (response.status === 404) {
            friendlyMessage = "API route not found. Please verify the backend endpoint.";
            errCode = "ApiRouteNotFound";
          } else if (response.status === 401) {
            friendlyMessage = "Authentication failed. Invalid credentials.";
            errCode = "AuthenticationFailed";
          } else if (response.status === 403) {
            friendlyMessage = "Firestore permission denied. Unauthorized operation.";
            errCode = "FirestorePermissionDenied";
          } else if (response.status === 500) {
            friendlyMessage = "Backend database or serverless service is currently unavailable.";
            errCode = "DatabaseUnavailable";
          }
          
          if (text.includes("Firebase") || text.includes("firestore") || text.includes("permission")) {
            friendlyMessage = "Firebase initialization failed or Firestore permission was denied.";
            errCode = "FirebaseInitializationFailed";
          } else if (text.includes("GEMINI_API_KEY") || text.includes("Gemini")) {
            friendlyMessage = "Missing or invalid Gemini API key configuration.";
            errCode = "MissingEnvironmentVariable";
          }
          
          return {
            success: false,
            message: friendlyMessage,
            error: errCode,
            rawText: text.substring(0, 500)
          };
        }
      } catch (readErr) {
        return {
          success: false,
          message: "Backend unavailable or network connection failed.",
          error: "BackendUnavailable"
        };
      }
    };

    return response;
  } catch (networkErr) {
    console.error("Fetch network error:", networkErr);
    // Return a fake response that mimics a failed request so the app can handle it gracefully
    return new Response(JSON.stringify({
      success: false,
      message: "Backend unavailable or network connection failed.",
      error: "BackendUnavailable"
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

try {
  Object.defineProperty(window, 'fetch', {
    value: customFetch,
    configurable: true,
    enumerable: true,
    writable: true
  });
} catch (err) {
  console.warn("Object.defineProperty on window.fetch failed, attempting direct assignment:", err);
  try {
    window.fetch = customFetch;
  } catch (assignErr) {
    console.error("Failed to intercept window.fetch completely:", assignErr);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

