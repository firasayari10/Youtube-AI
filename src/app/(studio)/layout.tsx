// app/(home)/layout.tsx
import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";
import { TRPCProvider } from "@/trpc/client";


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    
    
    <StudioLayout>
      <TRPCProvider>
      {children}
       </TRPCProvider>
    </StudioLayout>
   
    
  );
}
