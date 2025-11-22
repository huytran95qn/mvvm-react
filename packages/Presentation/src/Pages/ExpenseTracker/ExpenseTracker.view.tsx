import React from "react";
import { ExpenseTrackerViewModel } from "./ExpenseTracker.viewModel";
import { useViewModel } from "../../Hooks/useViewModel";
import { ViewModelProvider } from "../../Components/ViewModelProvider";

function GenerateExpenseTrackerView(): React.JSX.Element {
    const groups = useViewModel(
        ExpenseTrackerViewModel,
        vm => vm.getExpensesTrackersByGroup()
    );

    return (
        <div>
            <p>Expense Tracker</p>
            <pre>{JSON.stringify(groups)}</pre>
        </div>
    );
}

export function ExpenseTrackerView(): React.JSX.Element {
    return (
        <ViewModelProvider viewModel={ExpenseTrackerViewModel}>
            <GenerateExpenseTrackerView />
        </ViewModelProvider>
    )
}