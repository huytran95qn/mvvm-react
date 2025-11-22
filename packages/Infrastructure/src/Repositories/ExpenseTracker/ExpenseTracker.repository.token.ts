import { InjectionToken } from "@Core";
import { IExpenseTrackerRepository } from "@Domain/Repositories/ExpenseTracker";
import { ExpenseTrackerRepository } from "./ExpenseTracker.repository";

export const EXPENSE_TRACKER_REPOSITORY_TOKEN = new InjectionToken<IExpenseTrackerRepository>(
    'IExpenseTrackerRepository',
    ExpenseTrackerRepository
);