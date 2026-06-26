import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#features" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Preços", href: "#pricing" },
      { label: "Dúvidas", href: "#faq" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contato", href: "#" },
      { label: "Carreiras", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "#" },
      { label: "Privacidade", href: "#" },
      { label: "RGPD", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,_1fr)]">
          <div>
            <Image src="/logo.svg" alt="DrAgenda" width={137} height={28} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A plataforma de gestão para clínicas que querem crescer com
              organização, dados e atendimento humanizado.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DrAgenda. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Software de gestão para clínicas
          </p>
        </div>
      </div>
    </footer>
  );
}
