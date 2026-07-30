# TASK INSTRUCTION: Part 1 - Architecture Setup, Prisma Schema & Scalar API Docs

## 1. Context & Role
You are an expert Senior Backend Engineer executing Part 1 of the "Daily Catering & Order System" project. 
Your objective is to initialize a NestJS Modular Monolith architecture, design and generate a complete Prisma ORM PostgreSQL schema based on our Product Requirement Document (PRD), integrate Scalar for API Documentation (`/docs`), and build a database seeding script.

---

## 2. Tech Stack & Dependencies
- **Framework:** NestJS (TypeScript, Modular Monolith Architecture)
- **Database ORM:** Prisma ORM with PostgreSQL
- **API Documentation:** OpenAPI / Swagger integrated with Scalar (`@scalar/nestjs-api-reference`)
- **Utilities:** `class-validator`, `class-transformer`, `bcrypt`, `@nestjs/config`

Please ensure the following packages are installed:
```bash
npm install @prisma/client @nestjs/config class-validator class-transformer bcrypt @nestjs/swagger @scalar/nestjs-api-reference
npm install -D prisma @types/node @types/bcrypt

```

---

## 3. Database Schema Requirement (`prisma/schema.prisma`)

Please create `prisma/schema.prisma` with PostgreSQL provider. The database model must reflect all entities and relationships below:

### Enums

* `Role`: `ADMIN`, `CUSTOMER`, `KITCHEN`, `DRIVER`
* `DeliveryMethod`: `DELIVERY`, `PICKUP`
* `SubscriptionStatus`: `ACTIVE`, `PAUSED`, `COMPLETED`, `CANCELLED`
* `SkipStatus`: `PENDING`, `APPROVED`, `CANCELLED`
* `OrderStatus`: `PENDING_PAYMENT`, `PAID`, `IN_KITCHEN`, `ON_DELIVERY`, `DELIVERED`, `COMPLETED`, `CANCELLED`
* `PaymentStatus`: `PENDING`, `SUCCESS`, `FAILED`, `EXPIRED`

### Models Detail:

1. **User**
* `id`: String (UUID, @id, @default(uuid()))
* `email`: String (@unique)
* `password`: String
* `fullName`: String
* `phone`: String
* `role`: Role (@default(CUSTOMER))
* `createdAt`: DateTime (@default(now()))
* `updatedAt`: DateTime (@updatedAt)
* *Relations:* `addresses` (Address[]), `subscriptions` (Subscription[]), `orders` (Order[]), `reviews` (Review[])


2. **Address**
* `id`: String (UUID, @id, @default(uuid()))
* `userId`: String
* `label`: String (e.g. "Rumah", "Kantor")
* `fullAddress`: String
* `note`: String?
* `latitude`: Float
* `longitude`: Float
* `isPrimary`: Boolean (@default(false))
* `createdAt`: DateTime (@default(now()))
* `updatedAt`: DateTime (@updatedAt)
* *Relations:* `user` (User), `subscriptions` (Subscription[]), `orders` (Order[])


3. **DeliverySlot**
* `id`: String (UUID, @id, @default(uuid()))
* `name`: String (e.g., "Slot Pagi (06:30 - 08:00)")
* `startTime`: String (e.g., "06:30")
* `endTime`: String (e.g., "08:00")
* `maxCapacity`: Int (@default(50))
* `isActive`: Boolean (@default(true))
* `createdAt`: DateTime (@default(now()))
* `updatedAt`: DateTime (@updatedAt)
* *Relations:* `subscriptions` (Subscription[]), `orders` (Order[])


4. **Menu**
* `id`: String (UUID, @id, @default(uuid()))
* `name`: String
* `description`: String (@db.Text)
* `imageUrl`: String?
* `price`: Decimal (@db.Decimal(10, 2))
* `calories`: Int?
* `dietaryTags`: String[] (e.g., ["Halal", "High Protein"])
* `isActive`: Boolean (@default(true))
* `createdAt`: DateTime (@default(now()))
* `updatedAt`: DateTime (@updatedAt)
* *Relations:* `schedules` (DailyMenuSchedule[]), `orderItems` (OrderItem[])


5. **DailyMenuSchedule**
* `id`: String (UUID, @id, @default(uuid()))
* `menuId`: String
* `date`: DateTime (@db.Date)
* `createdAt`: DateTime (@default(now()))
* *Relations:* `menu` (Menu)


6. **Subscription**
* `id`: String (UUID, @id, @default(uuid()))
* `userId`: String
* `durationDays`: Int
* `startDate`: DateTime (@db.Date)
* `endDate`: DateTime (@db.Date)
* `remainingDays`: Int
* `status`: SubscriptionStatus (@default(ACTIVE))
* `deliveryMethod`: DeliveryMethod (@default(DELIVERY))
* `addressId`: String?
* `slotId`: String
* `createdAt`: DateTime (@default(now()))
* `updatedAt`: DateTime (@updatedAt)
* *Relations:* `user` (User), `address` (Address?), `slot` (DeliverySlot), `skips` (SubscriptionSkip[]), `orders` (Order[])


7. **SubscriptionSkip**
* `id`: String (UUID, @id, @default(uuid()))
* `subscriptionId`: String
* `skipDate`: DateTime (@db.Date)
* `status`: SkipStatus (@default(PENDING))
* `reason`: String?
* `createdAt`: DateTime (@default(now()))
* *Relations:* `subscription` (Subscription)


8. **Order**
* `id`: String (UUID, @id, @default(uuid()))
* `orderNumber`: String (@unique)
* `userId`: String
* `subscriptionId`: String?
* `deliveryMethod`: DeliveryMethod
* `addressId`: String?
* `slotId`: String
* `status`: OrderStatus (@default(PENDING_PAYMENT))
* `subtotal`: Decimal (@db.Decimal(10, 2))
* `deliveryFee`: Decimal (@db.Decimal(10, 2), @default(0))
* `totalPrice`: Decimal (@db.Decimal(10, 2))
* `notes`: String?
* `estimatedArrival`: DateTime?
* `proofOfDelivery`: String?
* `pickupPin`: String? (4-digit PIN for pickup)
* `createdAt`: DateTime (@default(now()))
* `updatedAt`: DateTime (@updatedAt)
* *Relations:* `user` (User), `subscription` (Subscription?), `address` (Address?), `slot` (DeliverySlot), `items` (OrderItem[]), `payment` (Payment?), `review` (Review?)


9. **OrderItem**
* `id`: String (UUID, @id, @default(uuid()))
* `orderId`: String
* `menuId`: String
* `price`: Decimal (@db.Decimal(10, 2))
* `quantity`: Int
* `specialNotes`: String?
* *Relations:* `order` (Order), `menu` (Menu)


10. **Payment**
* `id`: String (UUID, @id, @default(uuid()))
* `orderId`: String (@unique)
* `louvinInvoiceId`: String? (@unique)
* `louvinPaymentUrl`: String?
* `amount`: Decimal (@db.Decimal(10, 2))
* `status`: PaymentStatus (@default(PENDING))
* `rawCallbackPayload`: Json?
* `paidAt`: DateTime?
* `createdAt`: DateTime (@default(now()))
* `updatedAt`: DateTime (@updatedAt)
* *Relations:* `order` (Order)


11. **Review**
* `id`: String (UUID, @id, @default(uuid()))
* `orderId`: String (@unique)
* `userId`: String
* `rating`: Int (1-5)
* `comment`: String? (@db.Text)
* `photoUrl`: String?
* `createdAt`: DateTime (@default(now()))
* *Relations:* `order` (Order), `user` (User)



---

## 4. NestJS Architecture Directory Structure

Please create a modular folder structure in `src/`:

```text
src/
├── common/
│   ├── decorators/
│   ├── guards/
│   └── interceptors/
├── config/
│   └── configuration.ts
├── modules/
│   ├── auth/
│   ├── user/
│   ├── menu/
│   ├── subscription/
│   ├── order/
│   ├── payment/
│   ├── kitchen/
│   └── review/
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts
└── main.ts

```

---

## 5. Scalar API Reference Setup (`main.ts`)

Integrate Scalar API documentation in `src/main.ts` using `@scalar/nestjs-api-reference` and `@nestjs/swagger`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  // Swagger OpenAPI Config
  const config = new DocumentBuilder()
    .setTitle('Catering Platform API')
    .setDescription('Backend REST API documentation for Daily Catering & Order System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar API Docs Route
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📄 Scalar API Documentation: http://localhost:${port}/docs`);
}
bootstrap();

```

---

## 6. Database Seeder Script (`prisma/seed.ts`)

Create a seeder file `prisma/seed.ts` that will seed:

1. Default **Admin User**:
* Email: `admin@catering.com`
* Password: `Password123!` (hashed with bcrypt)
* Role: `ADMIN`


2. Default **Kitchen User**:
* Email: `kitchen@catering.com`
* Password: `Password123!` (hashed with bcrypt)
* Role: `KITCHEN`


3. Default **Driver User**:
* Email: `driver@catering.com`
* Password: `Password123!` (hashed with bcrypt)
* Role: `DRIVER`


4. Default **Delivery Slots**:
* Slot Pagi: `06:30 - 08:00` (Max Capacity: 50)
* Slot Siang: `11:00 - 12:30` (Max Capacity: 50)
* Slot Sore: `16:30 - 18:00` (Max Capacity: 50)



Configure `package.json` to include:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}

```

---

## 7. Expected Outputs Deliverable

1. Complete `prisma/schema.prisma` file with correct constraints and indexes.
2. `PrismaService` and `PrismaModule` configured properly.
3. Updated `src/main.ts` with Scalar API docs enabled at `/docs`.
4. Executed Prisma migration and database seeding script (`npx prisma db push` & `npx prisma db seed`).
5. A working server launch command test (`npm run start:dev`).

```

```