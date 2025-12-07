"use client";

import { Navbar05 } from "@/components/ui/shadcn-io/navbar-05";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface MainLayoutProps {
	children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
	const router = useRouter();
	const queryClient = new QueryClient();

	function onNavClick(href: string) {
		router.push(href);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<Navbar05
					navigationLinks={routes}
					onNavItemClick={onNavClick}
				/>
				{children}
			</div>
		</QueryClientProvider>
	);
}
