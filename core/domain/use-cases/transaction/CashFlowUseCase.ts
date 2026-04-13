// import { StudentRepository, CashFlowSummary } from "../../../types/entities";
// import { TransactionRepository } from "../../../types/repositories";
// import { Result, AppError } from "../../../errors";
// import { DateProvider } from "../../../application/providers/DateProvider";

// export class CashFlowUseCase {
//   constructor(
//     private readonly studentRepository: StudentRepository,
//     private readonly transactionRepository: TransactionRepository,
//     private readonly dateProvider: DateProvider
//   ) {}

//   async execute(userId: string): Promise<Result<CashFlowSummary>> {
//     try {
//       const students = await this.studentRepository.findByUserId(userId);
//       if (!students?.length) {
//         return Result.failure(new AppError("Nenhum estudante encontrado", 404));
//       }

//       const now = this.dateProvider.now();
//       const startCurrentMonth = this.dateProvider.startOfMonth(now);
//       const endCurrentMonth = this.dateProvider.endOfMonth(now);

//       let cashInHand = 0;
//       let previousToReceive = 0;
//       let previousToPay = 0;
//       let currentToReceive = 0;
//       let currentToPay = 0;
//       let totalReceipts = 0;
//       let totalExpenses = 0;

//       for (const student of students) {
//         const transactions = await this.transactionRepository.findByStudentId(
//           student.id
//         );

//         for (const tx of transactions) {
//           const { value, date, type, status } = tx;
//           const txDate = new Date(date);

//           if (type === "income") totalReceipts += value;
//           else totalExpenses += value;

//           if (status === "paid") {
//             cashInHand += type === "income" ? value : -value;
//           }

//           if (
//             status === "pending" &&
//             this.dateProvider.isBefore(txDate, startCurrentMonth)
//           ) {
//             if (type === "income") previousToReceive += value;
//             else previousToPay += value;
//           }

//           if (
//             status === "pending" &&
//             txDate >= startCurrentMonth &&
//             txDate <= endCurrentMonth
//           ) {
//             if (type === "income") currentToReceive += value;
//             else currentToPay += value;
//           }
//         }
//       }

//       const currentBalance = cashInHand + currentToReceive - currentToPay;

//       const summary: CashFlowSummary = {
//         cashInHand,
//         pending: {
//           previousMonths: {
//             toReceive: previousToReceive,
//             toPay: previousToPay,
//           },
//           currentMonth: {
//             toReceive: currentToReceive,
//             toPay: currentToPay,
//             balance: currentBalance,
//           },
//         },
//         totalReceipts,
//         totalExpenses,
//       };

//       return Result.success(summary);
//     } catch (error: any) {
//       return Result.failure(
//         new AppError(error.message || "Erro ao calcular fluxo de caixa", 500)
//       );
//     }
//   }
// }
