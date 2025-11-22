import {
    ExpensesTrackerUseCase,
} from "@Application/ExpenseTracker";
import type { IExpensesTrackerUseCase } from "@Application/ExpenseTracker";
import { Inject } from "@Core";

export class ExpenseTrackerViewModel {
    constructor(
        @Inject(ExpensesTrackerUseCase)
        private readonly expensesTrackerRepo: IExpensesTrackerUseCase
    ) {}

    getExpensesTrackersByGroup() {
        return this.expensesTrackerRepo.getExpensesTrackersByGroup();
    }
}