import { CartProvider, CartLink } from "@/components/Cart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary">Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Algo deu errado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente recarregar a página ou voltar ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-primary"
          >
            Tentar novamente
          </button>
          <a href="/" className="btn-ghost">Início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vida na Praia Leve - Leve uma vida mais leve" },
      { name: "description", content: "Refeições saudáveis congeladas, sucos detox, snacks funcionais e kits para transformar sua rotina. Praticidade premium com sabor de casa." },
      { name: "author", content: "Vida na Praia Leve" },
      { name: "theme-color", content: "#1F5D63" },
      { property: "og:title", content: "Vida na Praia Leve - Leve uma vida mais leve" },
      { property: "og:description", content: "Refeições saudáveis congeladas, sucos detox, snacks funcionais e kits para transformar sua rotina. Praticidade premium com sabor de casa." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Vida na Praia Leve" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vida na Praia Leve - Leve uma vida mais leve" },
      { name: "twitter:description", content: "Refeições saudáveis congeladas, sucos detox, snacks funcionais e kits para transformar sua rotina. Praticidade premium com sabor de casa." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8713acac-684c-41d3-9860-9e20d8b3486b/id-preview-6cf18aee--f67036b7-8b51-4744-8062-374910cfdbc3.lovable.app-1783717435288.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8713acac-684c-41d3-9860-9e20d8b3486b/id-preview-6cf18aee--f67036b7-8b51-4744-8062-374910cfdbc3.lovable.app-1783717435288.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Capriola:wght@400;700&family=Chivo:wght@300;400;500;600&family=Poppins:wght@300;400;500;600;700&family=Great+Vibes&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Vida na Praia Leve",
          description: "Marca brasileira de alimentação saudável, praticidade e qualidade de vida.",
          slogan: "Leve uma vida mais leve.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider><Outlet /><CartLink /></CartProvider>
    </QueryClientProvider>
  );
}
