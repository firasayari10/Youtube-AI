// app/(home)/layout.tsx
import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
import { TRPCProvider } from "@/trpc/client";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <HomeLayout>
      <TRPCProvider>
      {children}
      </TRPCProvider>
    </HomeLayout>
  );
}
