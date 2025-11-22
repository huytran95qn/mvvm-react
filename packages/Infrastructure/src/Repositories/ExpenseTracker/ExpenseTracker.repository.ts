import { Observable, of } from "rxjs";
import { BaseRepository } from "../Base.repository";
import { ExpenseTracker } from "@Domain/Entities/expenseTracker.entity";
import { type IExpenseTrackerRepository } from "@Domain/Repositories/ExpenseTracker/ExpenseTracker.repository.interface"

export class ExpenseTrackerRepository
    extends BaseRepository
    implements IExpenseTrackerRepository {
    public getAll(): Observable<ExpenseTracker[]> {
        return super.get("expenses");
    }
}