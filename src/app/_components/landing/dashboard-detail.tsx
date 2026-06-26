import { DashboardMockup } from "./dashboard-mockup";
import { Reveal } from "./reveal";

const annotations = [
  {
    title: "KPIs do dia em tempo real",
    body: "Receita, agendamentos e taxa de confirmação na primeira dobra. Decisão em segundos.",
  },
  {
    title: "Gráfico de faturamento",
    body: "Veja a saúde financeira da clínica nos últimos 7, 30 ou 90 dias num gesto.",
  },
  {
    title: "Próximas consultas com status",
    body: "Cada agendamento mostra o paciente, o médico responsável e o status atual da consulta.",
  },
];

export function DashboardDetail() {
  return (
    <section className="bg-muted/30 py-20 md:py-28" id="demonstracao">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Demonstração
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            O painel que você abre toda manhã.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pensado para ser entendido em 5 segundos, mesmo com a recepção em pé.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:items-center">
          <Reveal>
            <DashboardMockup tilt={false} />
          </Reveal>

          <Reveal delay={150}>
            <ol className="space-y-6">
              {annotations.map((a, i) => (
                <li key={a.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {a.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
