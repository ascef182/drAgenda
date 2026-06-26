import { ChevronDown } from "lucide-react";

import { Reveal } from "./reveal";

const items = [
  {
    q: "Preciso de cartão de crédito para testar?",
    a: "Não. Você cria sua conta com e-mail ou Google e usa o DrAgenda por 14 dias sem informar nenhum dado de pagamento. Gostou? Escolhe o plano depois. Não gostou? É só não continuar.",
  },
  {
    q: "Tenho mais de um médico na clínica. Funciona?",
    a: "Funciona muito bem. Cada profissional tem a sua própria agenda e os seus próprios horários de atendimento, e você acompanha o desempenho de cada um no painel — tudo num lugar só.",
  },
  {
    q: "E se dois agendamentos caírem no mesmo horário?",
    a: "Não tem como acontecer. O DrAgenda bloqueia automaticamente o segundo agendamento — nunca dois pacientes no mesmo horário do mesmo médico, mesmo que duas pessoas tentem marcar ao mesmo tempo. Adeus, paciente esperando na recepção por engano.",
  },
  {
    q: "Meus dados e os dos meus pacientes estão seguros?",
    a: "Sim. As informações da sua clínica ficam separadas das de qualquer outra e viajam sempre por conexão criptografada. Estamos preparando a operação para a Europa seguindo o RGPD — você continua dono dos seus dados, e nós só os tratamos para fazer o sistema funcionar para você.",
  },
  {
    q: "Posso trazer a minha agenda atual?",
    a: "Pode, e a gente ajuda. Na primeira semana, nossa equipe apoia você a configurar a conta e cadastrar os primeiros médicos e pacientes — sem custo adicional.",
  },
  {
    q: "Consigo usar no celular, fora do consultório?",
    a: "Sim. O DrAgenda abre direto no navegador, no computador, no tablet ou no celular. Nada para instalar — você acessa a sua agenda de onde estiver.",
  },
  {
    q: "Tenho fidelidade? Posso cancelar quando quiser?",
    a: "Sem fidelidade e sem letras miúdas. Você paga mês a mês e cancela quando quiser, em poucos cliques. Sem multa e sem precisar falar com ninguém.",
  },
  {
    q: "Em quanto tempo começo a usar?",
    a: "Em minutos. Você cria a conta, cadastra a clínica e já marca o primeiro agendamento no mesmo dia — sem treinamento e sem instalação.",
  },
];

export function Faq() {
  return (
    <section className="bg-muted/30 py-20 md:py-28" id="faq">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Dúvidas frequentes
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Antes de você perguntar.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <details className="group rounded-xl border border-border bg-card transition-colors hover:border-primary/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="text-base font-semibold text-foreground md:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.a}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
