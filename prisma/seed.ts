import { PrismaClient, Role, DeliveryMethod, OrderStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────
// DUMMY ACCOUNTS
// ─────────────────────────────────────────────
// Role      | Email                       | Password
// ──────────|─────────────────────────────|─────────────────
// ADMIN     | admin@catering.com          | Password123!
// CUSTOMER  | customer@catering.com       | Password123!
// CUSTOMER  | customer2@catering.com      | Password123!
// CUSTOMER  | customer3@catering.com      | Password123!
// KITCHEN   | kitchen@catering.com        | Password123!
// DRIVER    | driver@catering.com         | Password123!

async function main() {
  console.log('🌱 Mulai seeding database...\n');

  const PASSWORD = 'Password123!';
  const hashed = await bcrypt.hash(PASSWORD, 10);

  // ── 1. USERS (semua role) ──────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@catering.com' },
    update: {},
    create: {
      email: 'admin@catering.com',
      password: hashed,
      fullName: 'Administrator',
      phone: '081200000001',
      role: Role.ADMIN,
    },
  });

  const kitchen = await prisma.user.upsert({
    where: { email: 'kitchen@catering.com' },
    update: {},
    create: {
      email: 'kitchen@catering.com',
      password: hashed,
      fullName: 'Staf Dapur',
      phone: '081200000002',
      role: Role.KITCHEN,
    },
  });

  const driver = await prisma.user.upsert({
    where: { email: 'driver@catering.com' },
    update: {},
    create: {
      email: 'driver@catering.com',
      password: hashed,
      fullName: 'Kurir Pengiriman',
      phone: '081200000003',
      role: Role.DRIVER,
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer@catering.com' },
    update: {},
    create: {
      email: 'customer@catering.com',
      password: hashed,
      fullName: 'Budi Santoso',
      phone: '081200000004',
      role: Role.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@catering.com' },
    update: {},
    create: {
      email: 'customer2@catering.com',
      password: hashed,
      fullName: 'Siti Rahayu',
      phone: '081200000005',
      role: Role.CUSTOMER,
    },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: 'customer3@catering.com' },
    update: {},
    create: {
      email: 'customer3@catering.com',
      password: hashed,
      fullName: 'Ahmad Fauzi',
      phone: '081200000006',
      role: Role.CUSTOMER,
    },
  });

  console.log('✅ Users (6) berhasil dibuat');

  // ── 2. SYSTEM SETTINGS ────────────────────────────────────────────────────
  await prisma.systemSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      kitchenLatitude: -7.9666,   // Malang, Jawa Timur
      kitchenLongitude: 112.6326,
      maxRadiusKm: 15,
      baseDeliveryFee: 5000,
      feePerKm: 2000,
      businessName: 'Cateringin',
      businessPhone: '081200000001',
      businessAddress: 'Jl. Raya Katering No.1, Malang, Jawa Timur',
    },
  });

  console.log('✅ System Settings berhasil dibuat');

  // ── 3. DELIVERY SLOTS ─────────────────────────────────────────────────────
  // Pakai create karena tidak ada unique field selain id
  const existingSlots = await prisma.deliverySlot.findMany();
  let slotPagi: any, slotSiang: any, slotSore: any;

  if (existingSlots.length === 0) {
    slotPagi = await prisma.deliverySlot.create({
      data: {
        name: 'Slot Pagi',
        startTime: '06:30',
        endTime: '08:00',
        maxCapacity: 50,
        isActive: true,
      },
    });

    slotSiang = await prisma.deliverySlot.create({
      data: {
        name: 'Slot Siang',
        startTime: '11:00',
        endTime: '12:30',
        maxCapacity: 50,
        isActive: true,
      },
    });

    slotSore = await prisma.deliverySlot.create({
      data: {
        name: 'Slot Sore',
        startTime: '16:30',
        endTime: '18:00',
        maxCapacity: 50,
        isActive: true,
      },
    });

    console.log('✅ Delivery Slots (3) berhasil dibuat');
  } else {
    [slotPagi, slotSiang, slotSore] = existingSlots;
    console.log('ℹ️  Delivery Slots sudah ada, dilewati');
  }

  // ── 4. MENU ───────────────────────────────────────────────────────────────
  const menuData = [
    {
      name: 'Nasi Ayam Bakar',
      description: 'Nasi putih hangat dengan ayam bakar bumbu kecap, lalapan segar, dan sambal merah.',
      price: 25000,
      calories: 480,
      dietaryTags: ['gluten-free'],
      isActive: true,
    },
    {
      name: 'Nasi Rendang Sapi',
      description: 'Nasi putih dengan rendang sapi empuk khas Minang, dimasak dengan santan dan rempah pilihan.',
      price: 30000,
      calories: 550,
      dietaryTags: ['halal'],
      isActive: true,
    },
    {
      name: 'Nasi Sayur Lodeh',
      description: 'Nasi putih dengan sayur lodeh berisi labu siam, kacang panjang, tempe, dan santan gurih.',
      price: 18000,
      calories: 380,
      dietaryTags: ['vegetarian', 'halal'],
      isActive: true,
    },
    {
      name: 'Nasi Ikan Bakar Madu',
      description: 'Nasi putih dengan ikan nila bakar madu, tumis kangkung, dan sambal terasi.',
      price: 28000,
      calories: 430,
      dietaryTags: ['halal', 'high-protein'],
      isActive: true,
    },
    {
      name: 'Nasi Ayam Geprek',
      description: 'Nasi putih dengan ayam goreng tepung geprek, cabai rawit, dan mentimun segar.',
      price: 22000,
      calories: 520,
      dietaryTags: ['halal', 'spicy'],
      isActive: true,
    },
    {
      name: 'Nasi Tahu Tempe',
      description: 'Nasi putih dengan tahu goreng, tempe bacem, urap sayur, dan sambal hijau.',
      price: 15000,
      calories: 350,
      dietaryTags: ['vegetarian', 'vegan', 'halal'],
      isActive: true,
    },
  ];

  const existingMenus = await prisma.menu.findMany();
  let menus: any[] = existingMenus;

  if (existingMenus.length === 0) {
    menus = await Promise.all(
      menuData.map((m) =>
        prisma.menu.create({
          data: {
            name: m.name,
            description: m.description,
            price: m.price,
            calories: m.calories,
            dietaryTags: m.dietaryTags,
            isActive: m.isActive,
          },
        }),
      ),
    );
    console.log(`✅ Menu (${menus.length}) berhasil dibuat`);
  } else {
    console.log('ℹ️  Menu sudah ada, dilewati');
  }

  // ── 5. ADDRESS untuk Customer 1 ──────────────────────────────────────────
  const existingAddress = await prisma.address.findFirst({
    where: { userId: customer1.id },
  });

  let address1: any = existingAddress;
  if (!existingAddress) {
    address1 = await prisma.address.create({
      data: {
        userId: customer1.id,
        label: 'Rumah',
        fullAddress: 'Jl. Soekarno Hatta No. 12, Lowokwaru, Malang',
        note: 'Dekat minimarket, pagar biru',
        latitude: -7.9388,
        longitude: 112.6148,
        isPrimary: true,
      },
    });

    await prisma.address.create({
      data: {
        userId: customer1.id,
        label: 'Kantor',
        fullAddress: 'Jl. Ijen No. 45, Klojen, Malang',
        latitude: -7.9662,
        longitude: 112.6303,
        isPrimary: false,
      },
    });

    console.log('✅ Address (2) untuk customer1 berhasil dibuat');
  } else {
    console.log('ℹ️  Address sudah ada, dilewati');
  }

  // ── 6. SAMPLE ORDERS ─────────────────────────────────────────────────────
  const existingOrders = await prisma.order.findMany();
  if (existingOrders.length === 0 && menus.length > 0 && slotPagi) {

    // Order 1 — Customer1, status PAID (sudah bayar, belum diproses dapur)
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-20260905-1001',
        userId: customer1.id,
        deliveryMethod: DeliveryMethod.DELIVERY,
        addressId: address1?.id,
        slotId: slotPagi.id,
        status: OrderStatus.PAID,
        subtotal: 25000,
        deliveryFee: 7000,
        totalPrice: 32000,
        notes: 'Tolong jangan terlalu pedas',
        items: {
          create: [
            {
              menuId: menus[0].id,
              quantity: 1,
              price: 25000,
            },
          ],
        },
        payment: {
          create: {
            amount: 32000,
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
            louvinInvoiceId: 'LVN-DEMO-001',
          },
        },
      },
    });

    // Order 2 — Customer1, status IN_KITCHEN (sedang dimasak)
    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-20260905-1002',
        userId: customer1.id,
        deliveryMethod: DeliveryMethod.PICKUP,
        slotId: slotSiang.id,
        status: OrderStatus.IN_KITCHEN,
        subtotal: 48000,
        deliveryFee: 0,
        totalPrice: 48000,
        items: {
          create: [
            { menuId: menus[1].id, quantity: 1, price: 30000 },
            { menuId: menus[5].id, quantity: 1, price: 18000 },
          ],
        },
        payment: {
          create: {
            amount: 48000,
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
            louvinInvoiceId: 'LVN-DEMO-002',
          },
        },
      },
    });

    // Order 3 — Customer2, status COMPLETED (selesai)
    const order3 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-20260904-0099',
        userId: customer2.id,
        deliveryMethod: DeliveryMethod.PICKUP,
        slotId: slotSore.id,
        status: OrderStatus.COMPLETED,
        subtotal: 22000,
        deliveryFee: 0,
        totalPrice: 22000,
        items: {
          create: [
            { menuId: menus[4].id, quantity: 1, price: 22000 },
          ],
        },
        payment: {
          create: {
            amount: 22000,
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(Date.now() - 86400000), // kemarin
            louvinInvoiceId: 'LVN-DEMO-003',
          },
        },
      },
    });

    // Order 4 — Customer3, status CANCELLED (ditolak admin)
    const order4 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-20260904-0100',
        userId: customer3.id,
        deliveryMethod: DeliveryMethod.PICKUP,
        slotId: slotPagi.id,
        status: OrderStatus.CANCELLED,
        subtotal: 28000,
        deliveryFee: 0,
        totalPrice: 28000,
        rejectionReason: 'Bahan tidak tersedia pada hari tersebut.',
        items: {
          create: [
            { menuId: menus[3].id, quantity: 1, price: 28000 },
          ],
        },
        payment: {
          create: {
            amount: 28000,
            status: PaymentStatus.FAILED,
            louvinInvoiceId: 'LVN-DEMO-004',
          },
        },
      },
    });

    console.log(`✅ Orders (4) berhasil dibuat`);
    console.log(`   - ${order1.orderNumber} → ${order1.status}`);
    console.log(`   - ${order2.orderNumber} → ${order2.status}`);
    console.log(`   - ${order3.orderNumber} → ${order3.status}`);
    console.log(`   - ${order4.orderNumber} → ${order4.status}`);
  } else {
    console.log('ℹ️  Orders sudah ada atau data pendukung belum siap, dilewati');
  }

  // ── SUMMARY ──────────────────────────────────────────────────────────────
  console.log('\n📋 ======= SEED SELESAI =======');
  console.log('\n👤 Akun untuk Testing:\n');
  console.log('  Role      | Email                   | Password');
  console.log('  ──────────|─────────────────────────|─────────────');
  console.log(`  ADMIN     | admin@catering.com      | ${PASSWORD}`);
  console.log(`  CUSTOMER  | customer@catering.com   | ${PASSWORD}`);
  console.log(`  CUSTOMER  | customer2@catering.com  | ${PASSWORD}`);
  console.log(`  CUSTOMER  | customer3@catering.com  | ${PASSWORD}`);
  console.log(`  KITCHEN   | kitchen@catering.com    | ${PASSWORD}`);
  console.log(`  DRIVER    | driver@catering.com     | ${PASSWORD}`);
  console.log('\n===============================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

