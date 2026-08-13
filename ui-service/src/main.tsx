import './i18n/index.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './shared/api/queryClient.ts';
import router from './shared/router.tsx';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RtlThemeProvider } from '@/theme/RtlThemeProvider';
import { toasterOptions } from './shared/components/Toaster/toaster.ts';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RtlThemeProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <Toaster {...toasterOptions} />
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </RtlThemeProvider>
    </StrictMode>,
);
