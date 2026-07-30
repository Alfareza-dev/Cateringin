"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const adapter = new adapter_mariadb_1.PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@catering.com' },
        update: {},
        create: {
            email: 'admin@catering.com',
            password: hashedPassword,
            fullName: 'System Admin',
            phone: '081234567890',
            role: client_1.Role.ADMIN,
        },
    });
    const kitchen = await prisma.user.upsert({
        where: { email: 'kitchen@catering.com' },
        update: {},
        create: {
            email: 'kitchen@catering.com',
            password: hashedPassword,
            fullName: 'Kitchen Staff',
            phone: '081234567891',
            role: client_1.Role.KITCHEN,
        },
    });
    const driver = await prisma.user.upsert({
        where: { email: 'driver@catering.com' },
        update: {},
        create: {
            email: 'driver@catering.com',
            password: hashedPassword,
            fullName: 'Driver Partner',
            phone: '081234567892',
            role: client_1.Role.DRIVER,
        },
    });
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
//# sourceMappingURL=seed.js.map