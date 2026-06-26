"use client";

import {
  Building2,
  Calendar,
  CalendarClock,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

import { cn } from "@/lib/utils";

import { ChartMount } from "./chart-mount";
import { Reveal } from "./reveal";

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  highlight?: React.ReactNode;
  span?: "large" | "small";
};

const features: Feature[] = [
  {
    icon: Calendar,
    title: "Agenda à prova de conflito",
    body: "Encaixes por disponibilidade do médico e prevenção de duplo agendamento garantida no banco — não no frontend.",
    span: "large",
    highlight: <MiniAgenda />,
  },
  {
    icon: TrendingUp,
    title: "Dashboard financeiro",
    body: "Faturamento, número de consultas e receita por médico em tempo real. Sem exportar planilha.",
    span: "large",
    highlight: <MiniChart />,
  },
  {
    icon: CalendarClock,
    title: "Disponibilidade por médico",
    body: "Cada profissional define seus dias e faixas de horário. A agenda respeita automaticamente.",
    span: "small",
  },
  {
    icon: Users,
    title: "Histórico do paciente",
    body: "Cadastro completo com contato, consultas e histórico de atendimento numa só ficha.",
    span: "small",
  },
  {
    icon: Building2,
    title: "Isolamento por clínica",
    body: "Os dados de cada clínica ficam isolados desde o banco — sem risco de uma clínica ver dados de outra.",
    span: "small",
  },
  {
    icon: ShieldCheck,
    title: "Seguro por padrão",
    body: "Isolamento por clínica, autenticação com Google ou e-mail, e cobrança via Stripe — infraestrutura séria.",
    span: "small",
  },
];

export function FeaturesBento() {
  return (
    <section className="bg-muted/30 py-20 md:py-28" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Tudo num só painel
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            O que você ganha desde o primeiro dia.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pensado para a rotina real do consultório — não para slides de
            apresentação.
          </p>
        </Reveal>

        <div className="mt-14 grid auto-rows-[minmax(0,_auto)] grid-cols-1 gap-5 md:grid-cols-6">
          {features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={i * 60}
              className={cn(
                feature.span === "large"
                  ? "md:col-span-3"
                  : "md:col-span-2",
              )}
            >
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, body, highlight }: Feature) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg md:p-7">
      <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground md:text-xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
        {body}
      </p>
      {highlight ? <div className="mt-6">{highlight}</div> : null}
    </article>
  );
}

function MiniAgenda() {
  const slots = [
    { time: "08:00", patient: "Carla M.", state: "done" },
    { time: "09:00", patient: "Rafael T.", state: "done" },
    { time: "10:00", patient: "Próximo", state: "next" },
    { time: "11:00", patient: "Bloqueado", state: "blocked" },
    { time: "14:00", patient: "Livre", state: "free" },
  ];
  return (
    <ul className="space-y-1.5">
      {slots.map((s) => (
        <li
          key={s.time}
          className={cn(
            "flex items-center gap-3 rounded-md border px-3 py-2 text-xs",
            s.state === "done" &&
              "border-emerald-500/20 bg-emerald-500/5 text-emerald-700",
            s.state === "next" &&
              "border-primary/30 bg-primary/5 font-semibold text-primary",
            s.state === "blocked" &&
              "border-border bg-muted text-muted-foreground line-through",
            s.state === "free" && "border-dashed border-border text-muted-foreground",
          )}
        >
          <span className="font-mono">{s.time}</span>
          <span className="flex-1">{s.patient}</span>
        </li>
      ))}
    </ul>
  );
}

const miniChartData = [
  { d: 1, v: 1800 },
  { d: 2, v: 2200 },
  { d: 3, v: 2050 },
  { d: 4, v: 2800 },
  { d: 5, v: 3120 },
  { d: 6, v: 2940 },
  { d: 7, v: 3680 },
];

function MiniChart() {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">
            Faturamento da semana
          </p>
          <p className="text-xl font-bold text-foreground">€ 4.180</p>
        </div>
        <span className="text-xs font-semibold text-emerald-600">▲ 12,4%</span>
      </div>
      <div className="mt-2 h-20 w-full">
        <ChartMount>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={miniChartData}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="feat-mini-area" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin - 400", "dataMax + 400"]} />
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#feat-mini-area)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartMount>
      </div>
    </div>
  );
}
