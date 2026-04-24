/**
 * Provider-agnostic messaging interface.
 *
 * Provider chosen: WhatsApp Business API via Twilio (Fase 5).
 * Concrete implementation lives in src/providers/twilio.ts — never import
 * Twilio directly inside domain services.
 *
 * Extension rule:
 *   AppointmentService → MessagingService → TwilioProvider
 *
 * DEV MODE: When TWILIO_ACCOUNT_SID is "dummy", messages are logged to console
 * instead of being sent — safe for local development.
 */

import { isDummyValue } from "@/lib/env";

export type MessagePayload = {
  patientName: string;
  patientPhone: string;
  doctorName: string;
  appointmentDate: Date;
  clinicName: string;
};

function isMessagingDevMode(): boolean {
  return isDummyValue(process.env.TWILIO_ACCOUNT_SID);
}

export const MessagingService = {
  async sendAppointmentConfirmation(payload: MessagePayload): Promise<void> {
    if (isMessagingDevMode()) {
      console.log("[DEV] WhatsApp confirmation simulated", payload);
      return;
    }
    // Fase 5: await TwilioProvider.send(formatConfirmation(payload));
    // Fase 5: await UsageService.record({ type: "whatsapp_message" });
  },

  // Triggered 24h before appointment via cron job (Fase 5)
  async sendAppointmentReminder(payload: MessagePayload): Promise<void> {
    if (isMessagingDevMode()) {
      console.log("[DEV] WhatsApp reminder simulated", payload);
      return;
    }
    // Fase 5: await TwilioProvider.send(formatReminder(payload));
    // Fase 5: await UsageService.record({ type: "whatsapp_message" });
  },

  async sendAppointmentCancellation(payload: MessagePayload): Promise<void> {
    if (isMessagingDevMode()) {
      console.log("[DEV] WhatsApp cancellation simulated", payload);
      return;
    }
    // Fase 5: await TwilioProvider.send(formatCancellation(payload));
    // Fase 5: await UsageService.record({ type: "whatsapp_message" });
  },
};
