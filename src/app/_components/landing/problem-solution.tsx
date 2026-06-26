import { ClipboardX, TrendingDown, UserX } from "lucide-react";

import { Reveal } from "./reveal";

const problems = [
  {
    icon: ClipboardX,
    title: "Agenda fragmentada",
    body: "Papel, planilha e calendário separados — a recepção perde tempo conciliando o que cabia num só lugar.",
  },
  {
    icon: TrendingDown,
    title: "Caixa difícil de enxergar",
    body: "Faturamento, ticket médio, receita por médico — informações espalhadas em planilhas que ninguém atualiza no fim do mês.",
  },
  {
    icon: UserX,
    title: "Pacientes que somem do radar",
    body: "Sem cadastro centralizado, você só descobre que perdeu o paciente quando ele já está em outra clínica.",
  },
];

export function ProblemSolution() {
  return (
    <section className="py-20 md:py-28" id="problema">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            O dia-a-dia de quem gestiona uma clínica
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Você não precisa de outro sistema. Precisa de um que{" "}
            <span className="text-primary">resolva</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="group h-full rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-lg">
                <div className="flex size-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            DrAgenda organiza tudo isso num painel feito para a{" "}
            <span className="font-semibold text-foreground">
              rotina real do consultório
            </span>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
