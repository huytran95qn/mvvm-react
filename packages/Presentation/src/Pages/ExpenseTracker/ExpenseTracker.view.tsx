import React from "react";
import { ExpenseTrackerViewModel } from "./ExpenseTracker.viewModel";
import { get } from "@Core";
import { useObservable } from "../../Hooks/useObservable";

export function ExpenseTrackerView(): React.JSX.Element {
    const expenseTrackerViewModel = get(ExpenseTrackerViewModel);
    const value = useObservable(
        () => expenseTrackerViewModel.getExpensesTrackersByGroup()
    );

    return (
        <div>
            <p>Expense Tracker</p>
            <pre>{JSON.stringify(value)}</pre>
        </div>
    );
}