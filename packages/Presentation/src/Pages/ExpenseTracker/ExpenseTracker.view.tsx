import React from "react";
import { ExpenseTrackerViewModel } from "./ExpenseTracker.viewModel";
import { useViewModel, useObservable } from "@Components";

export function ExpenseTrackerView(): React.JSX.Element {
    const expenseTrackerViewModel = useViewModel(ExpenseTrackerViewModel);
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