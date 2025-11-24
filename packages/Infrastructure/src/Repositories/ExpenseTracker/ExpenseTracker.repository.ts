import { Observable, of } from "rxjs";
import { BaseRepository } from "../Base.repository";
import { ExpenseTracker } from "@Domain/Entities/expenseTracker.entity";
import {
    type IExpenseTrackerRepository
} from "@Domain/Repositories/ExpenseTracker"
import { Injectable } from "@Core";

@Injectable()
export class ExpenseTrackerRepository
    extends BaseRepository
    implements IExpenseTrackerRepository {
    public getAll(): Observable<ExpenseTracker[]> {
        return super.get("expenses");
    }
}