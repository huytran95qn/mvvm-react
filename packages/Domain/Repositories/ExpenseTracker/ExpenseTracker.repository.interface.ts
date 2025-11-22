import { ExpenseTracker } from "@Domain/Entities/expenseTracker.entity";
import { Observable } from "rxjs";

export interface IExpenseTrackerRepository {
    getAll(): Observable<ExpenseTracker[]>
}