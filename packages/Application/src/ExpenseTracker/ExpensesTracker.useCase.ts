import { Inject, Injectable } from "@Core";
import {
    type IExpenseTrackerRepository
} from "@Domain/Repositories/ExpenseTracker";
import { map, Observable } from "rxjs";
import { IExpensesTrackerUseCase } from "./ExpensesTracker.use-case.interface";
import { ExpenseTracker } from "@Domain/Entities/expenseTracker.entity";
import { EXPENSE_TRACKER_REPOSITORY_TOKEN } from "@Repositories/ExpenseTracker";

@Injectable()
export class ExpensesTrackerUseCase implements IExpensesTrackerUseCase {
    constructor(
        @Inject(EXPENSE_TRACKER_REPOSITORY_TOKEN)
        private readonly expenseTrackerRepository: IExpenseTrackerRepository
    ) {}

    public getExpensesTrackersByGroup(): Observable<{
        id: string,
        value: ExpenseTracker[]
    }[]> {
        return this.expenseTrackerRepository.getAll().pipe(
            map(items => items.reduce((groups, item) => {
                const found = groups.find(g => g.id == item.groupId);

                if (found) {
                    found.value.push(item);
                } else {
                    groups.push({
                        id: item.groupId,
                        value: [item]
                    });
                }

                return groups;
            }, [] as {
                id: string,
                value: ExpenseTracker[]
            }[]))
        );
    }    
}