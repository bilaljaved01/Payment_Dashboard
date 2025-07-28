import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(payment: Partial<Payment>) {
    return this.paymentModel.create(payment);
  }

  async findAll(filters: any) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.method) query.method = filters.method;
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }

    return this.paymentModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.paymentModel.findById(id);
  }

  async stats() {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - 6));

    const todayPayments = await this.paymentModel.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const weekPayments = await this.paymentModel.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    const failedCount = await this.paymentModel.countDocuments({
      status: 'failed',
    });

    const totalRevenueAgg = await this.paymentModel.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const last7DaysAgg = await this.paymentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          status: 'success',
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array(7)
      .fill(null)
      .map((_, i) => ({
        day: dayNames[(startOfWeek.getDay() + i) % 7],
        amount:
          last7DaysAgg.find((d) => d._id === ((startOfWeek.getDay() + i) % 7) + 1)?.total || 0,
      }));

    return {
      todayPayments,
      weekPayments,
      failedCount,
      totalRevenue,
      last7Days,
    };
  }
}
