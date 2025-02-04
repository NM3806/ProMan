'use client';

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

const queryClient = new QueryClient();

export const AppProvider = ({children} : {children : React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster/>
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  )
}