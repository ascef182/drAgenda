import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { AppointmentRepository } from "@/data/appointments";
import { DoctorRepository } from "@/data/doctors";
import { PatientRepository } from "@/data/patients";
import { generateTimeSlots } from "@/helpers/time";

dayjs.extend(utc);
dayjs.extend(timezone);

// ─────────────────────────────────────────────────────────────────────────────
// Domain Events
// Structure is defined now so types are stable when the event bus is wired.
// ─────────────────────────────────────────────────────────────────────────────

type AppointmentCreatedEvent = {
  type: "appointment.created";
  payload: {
    appointmentId: string;
    clinicId: string;
    doctorId: string;
    patientId: string;
    date: Date;
    priceInCents: number;
  };
};

type AppointmentCancelledEvent = {
  type: "appointment.cancelled";
  payload: {
    appointmentId: string;
    clinicId: string;
    doctorId: string;
    patientId: string;
    date: Date;
  };
};

type AppointmentDomainEvent = AppointmentCreatedEvent | AppointmentCancelledEvent;

// Fase 4: substituir o corpo por chamadas reais (AuditService, etc.)
// Falha na emissão NUNCA reverte a operação principal.
async function emitEvent(event: AppointmentDomainEvent): Promise<void> {
  try {
    // Fase 4: await AuditService.log(event);
    // Fase 5: await MessagingService.handleAppointmentEvent(event);
    // Fase 6: await FinancialService.handleAppointmentEvent(event);
    // Fase 6: await UsageService.record({ clinicId: event.payload.clinicId, type: "appointment" });
    void event;
  } catch {
    // Fase 4: logger.error("Event emission failed", { event });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Input types
// ─────────────────────────────────────────────────────────────────────────────

export type CreateAppointmentInput = {
  doctorId: string;
  patientId: string;
  date: Date;
  time: string; // "HH:mm:ss"
  appointmentPriceInCents: number;
};

export type AvailableSlot = {
  value: string;   // "HH:mm:ss"
  label: string;   // "HH:mm"
  available: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildAvailableSlots(
  doctor: { availableFromTime: string; availableToTime: string },
  occupiedTimes: string[],
): AvailableSlot[] {
  const timeSlots = generateTimeSlots();

  const doctorFrom = dayjs()
    .utc()
    .set("hour", Number(doctor.availableFromTime.split(":")[0]))
    .set("minute", Number(doctor.availableFromTime.split(":")[1]))
    .set("second", 0)
    .local();
  const doctorTo = dayjs()
    .utc()
    .set("hour", Number(doctor.availableToTime.split(":")[0]))
    .set("minute", Number(doctor.availableToTime.split(":")[1]))
    .set("second", 0)
    .local();

  const doctorSlots = timeSlots.filter((time) => {
    const slot = dayjs()
      .utc()
      .set("hour", Number(time.split(":")[0]))
      .set("minute", Number(time.split(":")[1]))
      .set("second", 0);
    return (
      slot.format("HH:mm:ss") >= doctorFrom.format("HH:mm:ss") &&
      slot.format("HH:mm:ss") <= doctorTo.format("HH:mm:ss")
    );
  });

  return doctorSlots.map((time) => ({
    value: time,
    label: time.substring(0, 5),
    available: !occupiedTimes.includes(time),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// AppointmentService — single entry point for all appointment business logic
// ─────────────────────────────────────────────────────────────────────────────

export const AppointmentService = {
  /**
   * Returns available time slots for a doctor on a given date.
   * Validates that the doctor belongs to the clinic (prevents cross-tenant probing).
   */
  async getAvailableSlots(
    doctorId: string,
    dateStr: string, // YYYY-MM-DD
    clinicId: string,
  ): Promise<AvailableSlot[]> {
    const doctor = await DoctorRepository.findById(doctorId);
    if (!doctor || doctor.clinicId !== clinicId) {
      throw new Error("Médico não encontrado");
    }

    const selectedDayOfWeek = dayjs(dateStr).day();
    const isAvailableOnDay =
      selectedDayOfWeek >= doctor.availableFromWeekDay &&
      selectedDayOfWeek <= doctor.availableToWeekDay;
    if (!isAvailableOnDay) return [];

    const appointmentsOnDate = await AppointmentRepository.findByDoctorAndDate(
      doctorId,
      dateStr,
    );
    const occupiedTimes = appointmentsOnDate.map((a) =>
      dayjs(a.date).format("HH:mm:ss"),
    );

    return buildAvailableSlots(doctor, occupiedTimes);
  },

  /**
   * Creates an appointment.
   * Validates ownership of doctor and patient, checks slot availability,
   * persists, and emits domain event.
   *
   * The DB unique constraint on (doctorId, date) is the last line of defense
   * against race conditions — a conflict error from Drizzle will propagate up.
   */
  async create(data: CreateAppointmentInput, clinicId: string) {
    // 1. Verify doctor belongs to this clinic
    const doctor = await DoctorRepository.findById(data.doctorId);
    if (!doctor || doctor.clinicId !== clinicId) {
      throw new Error("Médico não encontrado");
    }

    // 2. Verify patient belongs to this clinic
    const patient = await PatientRepository.findById(data.patientId);
    if (!patient || patient.clinicId !== clinicId) {
      throw new Error("Paciente não encontrado");
    }

    // 3. Verify the selected time slot is available
    const dateStr = dayjs(data.date).format("YYYY-MM-DD");
    const slots = await AppointmentService.getAvailableSlots(
      data.doctorId,
      dateStr,
      clinicId,
    );
    const isAvailable = slots.some(
      (s) => s.value === data.time && s.available,
    );
    if (!isAvailable) {
      throw new Error("Horário não disponível");
    }

    // 4. Build the exact appointment datetime
    const appointmentDateTime = dayjs(data.date)
      .set("hour", parseInt(data.time.split(":")[0]))
      .set("minute", parseInt(data.time.split(":")[1]))
      .set("second", 0)
      .toDate();

    // 5. Persist — DB constraint catches any race condition double-booking
    const [appointment] = await AppointmentRepository.insert({
      doctorId: data.doctorId,
      patientId: data.patientId,
      clinicId,
      date: appointmentDateTime,
      appointmentPriceInCents: data.appointmentPriceInCents,
      // Fase 6: FinancialService.recordPayment() will handle actual payment tracking
    });

    // 6. Emit domain event (non-blocking, never throws)
    await emitEvent({
      type: "appointment.created",
      payload: {
        appointmentId: appointment.id,
        clinicId,
        doctorId: data.doctorId,
        patientId: data.patientId,
        date: appointmentDateTime,
        priceInCents: data.appointmentPriceInCents,
      },
    });

    return appointment;
  },

  /**
   * Deletes an appointment.
   * Verifies ownership before deletion and emits cancellation event.
   */
  async delete(id: string, clinicId: string) {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment || appointment.clinicId !== clinicId) {
      throw new Error("Agendamento não encontrado");
    }

    await AppointmentRepository.delete(id);

    await emitEvent({
      type: "appointment.cancelled",
      payload: {
        appointmentId: id,
        clinicId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        date: appointment.date,
      },
    });
  },
};
