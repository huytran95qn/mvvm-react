import { ExpenseTracker } from "packages/Domain/Entities/expenseTracker.entity";
import { Observable } from "rxjs";

export interface IExpenseTrackerRepository {
    getAll(): Observable<ExpenseTracker[]>
}