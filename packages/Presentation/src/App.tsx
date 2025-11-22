import { useInjector } from '@Core';
import { ExpenseTracker } from 'packages/Domain/Entities/expenseTracker.entity';
import { ExpensesTrackerUseCase } from '@Application/ExpenseTracker';
import './App.css'
import { useEffect, useState } from 'react';

function App() {
    const expeneTrackerRepository = useInjector(ExpensesTrackerUseCase);
    const [state, setState] = useState<{
        id: string;
        value: ExpenseTracker[];
    }[]>();

    useEffect(() => {
        const subscription = expeneTrackerRepository
            .getExpensesTrackersByGroup()
            .subscribe({
                next: groups => setState(groups)
            });

        return () => subscription.unsubscribe();
    }, [expeneTrackerRepository]);

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
