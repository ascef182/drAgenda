"use client";

import { CalendarCheck, CheckCircle2, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

import { cn } from "@/lib/utils";

import { ChartMount } from "./chart-mount";

const revenueData = [
  { day: "Seg", value: 3120 },
  { day: "Ter", value: 3680 },
  { day: "Qua", value: 3340 },
  { day: "Qui", value: 4250 },
  { day: "Sex", value: 4880 },
  { day: "Sáb", value: 3260 },
  { day: "Dom", value: 1940 },
];

type Appointment = {
  initials: string;
  name: string;
  time: string;
  doctor: string;
  status: "confirmado" | "pendente";
};

const appointments: Appointment[] = [
  {
    initials: "MR",
    name: "Maria Rodrigues",
    time: "09:30",
    doctor: "Dra. Ana Costa",
    status: "confirmado",
  },
  {
    initials: "JS",
    name: "João Silveira",
    time: "10:15",
    doctor: "Dr. Pedro Lima",
    status: "confirmado",
  },
  {
    initials: "LC",
    name: "Luiza Camargo",
    time: "11:00",
    doctor: "Dra. Ana Costa",
    status: "pendente",
  },
];

type DashboardMockupProps = {
  className?: string;
  tilt?: boolean;
};

export function DashboardMockup({ className, tilt = true }: DashboardMockupProps) {
  return (
    <div
      className={cn(
        "relative w-full select-none",
        tilt && "md:rotate-[0.6deg]",
        className,
      )}
    >
      {/* Soft glow behind */}
      <div
        aria-hidden
        className="absolute -inset-x-8 -top-8 -bottom-8 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)/14%,_transparent_60%)] blur-2xl"
      />

      <div className="rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-black/5 overflow-hidden">
        {/* Faux window chrome */}
        <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="hidden items-center gap-1.5 rounded-md border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            app.dragenda.com/dashboard
          </div>
          <div className="w-12" />
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:p-6">
          {/* Header row */}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Visão geral
              </p>
              <p className="mt-0.5 text-base font-semibold text-foreground">
                Bom dia, Dra. Ana
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
              Ao vivo
            </span>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<TrendingUp className="size-4" />}
              label="Receita semana"
              value="€ 5.480"
              delta="+18%"
              positive
            />
            <StatCard
              icon={<CalendarCheck className="size-4" />}
              label="Consultas hoje"
              value="18"
              delta="3 livres"
            />
            <StatCard
              icon={<CheckCircle2 className="size-4" />}
              label="Concluídas"
              value="14"
              delta="hoje"
              positive
            />
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Faturamento — últimos 7 dias
                </p>
                <p className="text-lg font-bold text-foreground">€ 5.480</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">
                ▲ 18,4%
              </span>
            </div>
            <div className="h-28 w-full">
              <ChartMount>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="mockup-area"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                    <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      fill="url(#mockup-area)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartMount>
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-medium text-muted-foreground">
              {revenueData.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          </div>

          {/* Appointments list */}
          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Próximas consultas
              </p>
              <span className="text-[11px] text-muted-foreground">Hoje · 18</span>
            </div>
            <ul className="space-y-2.5">
              {appointments.map((apt) => (
                <li
                  key={apt.name}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {apt.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {apt.name}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {apt.doctor}
                    </p>
                  </div>
                  <p className="text-xs font-mono font-medium text-muted-foreground">
                    {apt.time}
                  </p>
                  {apt.status === "confirmado" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
                      <CheckCircle2 className="size-3" />
                      Confirmado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-500/20">
                      Pendente
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/60 p-3">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-1.5 text-lg font-bold text-foreground tabular-nums">
        {value}
      </p>
      <p
        className={cn(
          "text-[11px] font-semibold",
          positive ? "text-emerald-600" : "text-muted-foreground",
        )}
      >
        {delta}
      </p>
    </div>
  );
}
