import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { CreateRepaymentDto } from './dto/create-repayment.dto';
import dayjs from 'dayjs';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  listLoans(userId: string) {
    return this.prisma.loan.findMany({
      where: { userId },
      include: {
        repayments: {
          orderBy: { paidAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  createLoan(userId: string, dto: CreateLoanDto) {
    return this.prisma.loan.create({
      data: {
        userId,
        principal: dto.principal,
        lender: dto.lender,
        interestRate: dto.interestRate,
        startDate: new Date(dto.startDate),
        termMonths: dto.termMonths,
        notes: dto.notes,
      },
    });
  }

  async addRepayment(
    userId: string,
    loanId: string,
    dto: CreateRepaymentDto,
  ) {
    await this.ensureLoanOwnership(userId, loanId);
    return this.prisma.repayment.create({
      data: {
        loanId,
        amount: dto.amount,
        paidAt: new Date(dto.paidAt),
        method: dto.method,
        notes: dto.notes,
      },
    });
  }

  async summary(userId: string) {
    const loans = await this.listLoans(userId);
    const totals = loans.reduce(
      (acc, loan) => {
        const principal = Number(loan.principal);
        const rate = loan.interestRate ? Number(loan.interestRate) : 0;
        const expectedInterest = principal * (rate / 100);
        const expectedTotal = principal + expectedInterest;
        const paid = loan.repayments.reduce(
          (sum, repayment) => sum + Number(repayment.amount),
          0,
        );
        const dueDate = dayjs(loan.startDate).add(
          loan.termMonths,
          'month',
        );
        acc.total += expectedTotal;
        acc.paid += paid;
        acc.balance += Math.max(expectedTotal - paid, 0);
        if (
          acc.nextDueDate == null ||
          dueDate.toDate() < acc.nextDueDate
        ) {
          acc.nextDueDate = dueDate.toDate();
        }
        return acc;
      },
      {
        total: 0,
        paid: 0,
        balance: 0,
        nextDueDate: null as Date | null,
      },
    );
    return totals;
  }

  private async ensureLoanOwnership(userId: string, loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      select: { userId: true },
    });
    if (!loan || loan.userId !== userId) {
      throw new NotFoundException('Loan not found');
    }
  }
}
