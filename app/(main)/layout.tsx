"use client";

import { Navbar05 } from "@/components/ui/shadcn-io/navbar-05";
import { useRouter } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();

  function onNavClick(href: string) {
    router.push(href);
  }

  return (
    <div>
      <Navbar05 onNavItemClick={onNavClick} />
      {children}
    </div>
  );
}
