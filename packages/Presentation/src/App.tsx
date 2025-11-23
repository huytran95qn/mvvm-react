import './App.css';
import { ViewModelProvider } from './Components/ViewModelProvider';
import { ExpenseTrackerView } from './Pages/ExpenseTracker/ExpenseTracker.view';
import { ExpenseTrackerViewModel } from './Pages/ExpenseTracker/ExpenseTracker.viewModel';

function App() {
    return (
        <div className="App">
        <header className="App-header">
            <h1>MVVM React - Presentation Layer</h1>
            <p>Welcome to your MVVM React application!</p>

            <ViewModelProvider viewModel={ExpenseTrackerViewModel}>
                <ExpenseTrackerView />
            </ViewModelProvider>
            
        </header>
        </div>
    )
}

export default App
