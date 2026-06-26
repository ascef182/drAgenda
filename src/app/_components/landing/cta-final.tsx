import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Reveal } from "./reveal";

export function CtaFinal() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_white/15%,_transparent_50%),radial-gradient(ellipse_at_bottom_left,_white/10%,_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Sua próxima consulta já podia estar marcada.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-primary-foreground/80 md:text-lg">
            Comece grátis em menos de 1 minuto. Sem cartão. Sem fidelidade.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 bg-white px-7 text-base font-semibold text-primary shadow-xl shadow-black/10 transition-all duration-200 hover:bg-white/95 hover:shadow-2xl"
            >
              <Link href="/authentication">
                Criar minha conta
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 px-6 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            >
              <Link href="#demonstracao">Ver demonstração</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
