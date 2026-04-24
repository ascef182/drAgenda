/**
 * Development seed script.
 * Creates sample clinic, doctor, and patient for local testing.
 *
 * Usage:
 *   npm run db:seed
 *
 * After seeding:
 *   1. Register at http://localhost:3000/authentication
 *   2. Create your clinic at /clinic-form (takes 30s)
 *   3. Or run the SQL below to link your account to the seeded clinic:
 *
 *   INSERT INTO users_to_clinics (user_id, clinic_id)
 *   VALUES ('<your-user-id>', '<seeded-clinic-id>');
 */

import "dotenv/config";

import { db } from "./index";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "./schema";

async function seed() {
  console.log("🌱 Seeding database...\n");

  // Wipe existing seed data to make script idempotent
  await db.delete(appointmentsTable);
  await db.delete(doctorsTable);
  await db.delete(patientsTable);
  await db.delete(clinicsTable);

  // 1. Clinic
  const [clinic] = await db
    .insert(clinicsTable)
    .values({ name: "Clínica DrAgenda Demo" })
    .returning();
  console.log(`✅ Clinic created`);
  console.log(`   ID:   ${clinic.id}`);
  console.log(`   Name: ${clinic.name}\n`);

  // 2. Doctor
  const [doctor] = await db
    .insert(doctorsTable)
    .values({
      clinicId: clinic.id,
      name: "Dr. Ana Lima",
      specialty: "Cardiologia",
      appointmentPriceInCents: 15000,
      availableFromWeekDay: 1, // Monday
      availableToWeekDay: 5, // Friday
      availableFromTime: "08:00:00",
      availableToTime: "18:00:00",
    })
    .returning();
  console.log(`✅ Doctor created: ${doctor.name} (${doctor.specialty})`);

  // 3. Patient
  const [patient] = await db
    .insert(patientsTable)
    .values({
      clinicId: clinic.id,
      name: "João Silva",
      email: "joao.silva@demo.com",
      phoneNumber: "11999990001",
      sex: "male",
    })
    .returning();
  console.log(`✅ Patient created: ${patient.name}\n`);

  console.log("─────────────────────────────────────────────");
  console.log("🚀 Next steps:");
  console.log("   1. Register at http://localhost:3000/authentication");
  console.log("   2. Create your clinic OR link to the seeded one:");
  console.log(`\n   INSERT INTO users_to_clinics (user_id, clinic_id)`);
  console.log(`   VALUES ('<your-user-id>', '${clinic.id}');\n`);
  console.log("   3. Start the app: npm run dev");
  console.log("─────────────────────────────────────────────\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
