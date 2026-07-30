import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateMenuScheduleDto } from './dto/create-menu-schedule.dto';
import { BulkCreateMenuScheduleDto } from './dto/bulk-create-menu-schedule.dto';
import { GetMenuFilterDto } from './dto/get-menu-filter.dto';
import { GetScheduleFilterDto } from './dto/get-schedule-filter.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  async findAll(filterDto: GetMenuFilterDto) {
    const { search, isActive, page = 1, limit = 10 } = filterDto;

    const where: any = {};
    if (search) {
      where.name = { contains: search };
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.menu.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.menu.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id);
    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Soft delete by setting isActive to false
    return this.prisma.menu.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // --- Scheduler Logic ---

  async scheduleMenu(createMenuScheduleDto: CreateMenuScheduleDto) {
    const { menuId, date } = createMenuScheduleDto;
    const dateObj = new Date(date);

    await this.findOne(menuId);

    const existing = await this.prisma.dailyMenuSchedule.findFirst({
      where: {
        menuId,
        date: dateObj,
      },
    });

    if (existing) {
      throw new ConflictException(`Menu is already scheduled for ${date}`);
    }

    return this.prisma.dailyMenuSchedule.create({
      data: {
        menuId,
        date: dateObj,
      },
    });
  }

  async bulkScheduleMenus(bulkDto: BulkCreateMenuScheduleDto) {
    const { menuIds, dates } = bulkDto;

    // Verify all menus exist
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds } },
    });

    if (menus.length !== menuIds.length) {
      throw new NotFoundException('One or more menus not found');
    }

    const payload = [];
    for (const menuId of menuIds) {
      for (const dateStr of dates) {
        const dateObj = new Date(dateStr);
        // Avoid duplicates in memory payload
        payload.push({ menuId, date: dateObj });
      }
    }

    // Filter out existing ones.
    const allExisting = await this.prisma.dailyMenuSchedule.findMany({
      where: {
        menuId: { in: menuIds },
        date: { in: dates.map((d) => new Date(d)) },
      },
    });

    const existingSet = new Set(
      allExisting.map(
        (e) => `${e.menuId}_${e.date.toISOString().split('T')[0]}`,
      ),
    );

    const filteredPayload = payload.filter(
      (p) =>
        !existingSet.has(`${p.menuId}_${p.date.toISOString().split('T')[0]}`),
    );

    if (filteredPayload.length > 0) {
      await this.prisma.dailyMenuSchedule.createMany({
        data: filteredPayload,
      });
    }

    return {
      message: `Successfully scheduled ${filteredPayload.length} items. Skipped ${payload.length - filteredPayload.length} duplicates.`,
      scheduledCount: filteredPayload.length,
    };
  }

  async getSchedules(filterDto: GetScheduleFilterDto) {
    const { startDate, endDate } = filterDto;

    const where: any = {};
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = { gte: new Date(startDate) };
    } else if (endDate) {
      where.date = { lte: new Date(endDate) };
    }

    const schedules = await this.prisma.dailyMenuSchedule.findMany({
      where,
      include: {
        menu: true,
      },
      orderBy: { date: 'asc' },
    });

    // Group by date
    const grouped = schedules.reduce(
      (acc, curr) => {
        const dateKey = curr.date.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(curr);
        return acc;
      },
      {} as Record<string, typeof schedules>,
    );

    return grouped;
  }

  async removeSchedule(id: string) {
    const schedule = await this.prisma.dailyMenuSchedule.findUnique({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return this.prisma.dailyMenuSchedule.delete({
      where: { id },
    });
  }
}
