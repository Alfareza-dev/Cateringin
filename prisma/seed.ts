import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Default Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@catering.com' },
    update: {},
    create: {
      email: 'admin@catering.com',
      password: hashedPassword,
      fullName: 'System Admin',
      phone: '081234567890',
      role: Role.ADMIN,
    },
  });

  // 2. Default Kitchen User
  const kitchen = await prisma.user.upsert({
    where: { email: 'kitchen@catering.com' },
    update: {},
    create: {
      email: 'kitchen@catering.com',
      password: hashedPassword,
      fullName: 'Kitchen Staff',
      phone: '081234567891',
      role: Role.KITCHEN,
    },
  });

  // 3. Default Driver User
  const driver = await prisma.user.upsert({
    where: { email: 'driver@catering.com' },
    update: {},
    create: {
      email: 'driver@catering.com',
      password: hashedPassword,
      fullName: 'Driver Partner',
      phone: '081234567892',
      role: Role.DRIVER,
    },
  });

  // 4. Default Delivery Slots
  const slotPagi = await prisma.deliverySlot.create({
    data: {
      name: 'Slot Pagi (06:30 - 08:00)',
      startTime: '06:30',
      endTime: '08:00',
      maxCapacity: 50,
    },
  });

  const slotSiang = await prisma.deliverySlot.create({
    data: {
      name: 'Slot Siang (11:00 - 12:30)',
      startTime: '11:00',
      endTime: '12:30',
      maxCapacity: 50,
    },
  });

  const slotSore = await prisma.deliverySlot.create({
    data: {
      name: 'Slot Sore (16:30 - 18:00)',
      startTime: '16:30',
      endTime: '18:00',
      maxCapacity: 50,
    },
  });

  console.log('Seeding completed:');
  console.log({ admin, kitchen, driver, slotPagi, slotSiang, slotSore });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
