import './index.css';
import './i18n/index.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './shared/api/queryClient.ts';
import router from './shared/router.tsx';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        style: {
                            background: '#16191d',
                            color: '#e4e7eb',
                            border: '1px solid #2a2f36',
                            fontFamily: 'system-ui, sans-serif',
                        },
                        error: {
                            iconTheme: { primary: '#e5484d', secondary: '#16191d' },
                        },
                        success: {
                            iconTheme: { primary: '#2f9e5f', secondary: '#16191d' },
                        },
                    }}
                />
            </QueryClientProvider>
        </GoogleOAuthProvider>
    </StrictMode>,
);
