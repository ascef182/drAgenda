import { CalendarX2, Lock, TrendingUp } from "lucide-react";

import { Reveal } from "./reveal";

const reasons = [
  {
    icon: CalendarX2,
    title: "Agenda à prova de conflito",
    body: "A prevenção de duplo agendamento é uma constraint no banco — não depende de validação no frontend nem da memória da recepção.",
  },
  {
    icon: TrendingUp,
    title: "Visão financeira em tempo real",
    body: "Faturamento, número de consultas e receita por médico atualizados a cada agendamento. Sem exportar planilha.",
  },
  {
    icon: Lock,
    title: "Dados isolados por clínica",
    body: "Multi-tenant nativo: cada clínica tem seu próprio espaço de dados desde a camada do banco. Você decide o que compartilha.",
  },
];

export function Roi() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Por que escolher
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Engenharia séria, do banco à interface.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cada decisão técnica foi feita pensando em clínica que precisa
            crescer sem dor de cabeça.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-border bg-card p-8">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <r.icon className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {r.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {r.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
