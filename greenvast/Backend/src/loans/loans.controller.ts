import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateLoanDto } from './dto/create-loan.dto';
import { CreateRepaymentDto } from './dto/create-repayment.dto';

@ApiTags('Loans')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'loans', version: '1' })
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  listLoans(@CurrentUser() user: RequestUser) {
    return this.loansService.listLoans(user.userId!);
  }

  @Get('summary')
  summary(@CurrentUser() user: RequestUser) {
    return this.loansService.summary(user.userId!);
  }

  @Post()
  createLoan(@CurrentUser() user: RequestUser, @Body() dto: CreateLoanDto) {
    return this.loansService.createLoan(user.userId!, dto);
  }

  @Post(':loanId/repayments')
  addRepayment(
    @CurrentUser() user: RequestUser,
    @Param('loanId') loanId: string,
    @Body() dto: CreateRepaymentDto,
  ) {
    return this.loansService.addRepayment(user.userId!, loanId, dto);
  }
}
