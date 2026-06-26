import { CalendarClock, LineChart, Lock, ShieldCheck } from "lucide-react";

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Dados isolados por clínica",
    body: "Isolamento multi-tenant desde o banco de dados.",
  },
  {
    icon: CalendarClock,
    title: "Anti-duplo-agendamento",
    body: "Garantido por constraint no banco, não no frontend.",
  },
  {
    icon: LineChart,
    title: "Dashboard financeiro",
    body: "Receita, consultas e desempenho por médico.",
  },
  {
    icon: Lock,
    title: "Login seguro",
    body: "Autenticação com e-mail ou Google.",
  },
];

export function SocialProof() {
  return (
    <section
      className="border-y border-border/60 bg-muted/30 py-10"
      aria-label="Diferenciais do produto"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Construído para clínicas que querem escalar com segurança
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop) => (
            <li key={prop.title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                <prop.icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {prop.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {prop.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
