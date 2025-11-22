import { ExpenseTracker } from "@Domain/Entities/expenseTracker.entity";
import { Observable } from "rxjs";

export interface IExpensesTrackerUseCase {
    getExpensesTrackersByGroup(): Observable<{
        id: string,
        value: ExpenseTracker[]
    }[]>;
}