'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  return clientQueryClientSingleton ??= makeQueryClient();
}

function getUrl() {
  if (typeof window !== 'undefined') return '/api/trpc';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/trpc`;
  return 'http://localhost:3000/api/trpc';
}

export function TRPCProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
     
      links: [
        httpBatchLink({
         
          transformer: superjson, 
           url: getUrl(),     
           async headers(){
            const headers = new Headers();
            headers.set("x-trpc-source","nextjs-react");
            return headers
           }   
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
