import {
    ExpensesTrackerUseCase,
} from "@Application/ExpenseTracker";
import type { IExpensesTrackerUseCase } from "@Application/ExpenseTracker";
import { Inject, Injectable } from "@Core";

@Injectable()
export class ExpenseTrackerViewModel {
    constructor(
        @Inject(ExpensesTrackerUseCase)
        private readonly expensesTrackerRepo: IExpensesTrackerUseCase
    ) {}

    getExpensesTrackersByGroup() {
        return this.expensesTrackerRepo.getExpensesTrackersByGroup();
    }
}