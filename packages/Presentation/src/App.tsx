import { useInjector } from '@Core';
import { ExpensesTrackerUseCase } from '@Application/ExpenseTracker';
import './App.css'
import { useEffect, useState } from 'react';
import { ExpenseTracker } from '@Domain/Entities/expenseTracker.entity';

function App() {
    const expensesTrackerRepo = useInjector(ExpensesTrackerUseCase);
    const [state, setState] = useState<{
        id: string;
        value: ExpenseTracker[];
    }[]>();

    useEffect(() => {
        const subscription = expensesTrackerRepo
            .getExpensesTrackersByGroup()
            .subscribe({
                next: groups => setState(groups)
            });

        return () => subscription.unsubscribe();
    }, [expensesTrackerRepo]);

    return (
        <div className="App">
        <header className="App-header">
            <h1>MVVM React - Presentation Layer</h1>
            <p>Welcome to your MVVM React application!</p>

            <div>
                {JSON.stringify(state)}
            </div>
        </header>
        </div>
    )
}

export default App
