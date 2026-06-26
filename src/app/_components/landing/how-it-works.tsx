import { Reveal } from "./reveal";

const steps = [
  {
    n: "01",
    title: "Crie sua clínica",
    body: "1 minuto. Email ou Google. Sem cartão.",
  },
  {
    n: "02",
    title: "Cadastre médicos e horários",
    body: "Importe sua lista de pacientes e configure a disponibilidade.",
  },
  {
    n: "03",
    title: "Acompanhe em tempo real",
    body: "Dashboard atualiza a cada agendamento. Você decide com dado, não com achismo.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28" id="como-funciona">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Sai do papel em 3 passos.
          </h2>
        </Reveal>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden
            className="absolute top-8 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 120} className="relative">
              <div className="relative z-10 mb-5 flex size-16 items-center justify-center rounded-2xl border border-border bg-background text-2xl font-extrabold tabular-nums text-primary shadow-sm">
                {step.n}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
