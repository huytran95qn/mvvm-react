import { Observable, of } from "rxjs";
import { Injectable } from "@Core";
import { BaseRepository } from "../Base.repository";
import { MOCK_DATA_EXPENSE_TRACKER } from "./ExpenseTracker.repository.data";
import { IExpenseTrackerRepository } from "./ExpenseTracker.repository.interface";
import { ExpenseTracker } from "@Entities/expenseTracker.entity";

@Injectable()
export class ExpenseTrackerRepository
    extends BaseRepository
    implements IExpenseTrackerRepository {
    public getAll(): Observable<ExpenseTracker[]> {
        return super.get("expenses");
    }
}