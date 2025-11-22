import './App.css';
import { ExpenseTrackerView } from './Pages/ExpenseTracker/ExpenseTracker.view';

function App() {
    return (
        <div className="App">
        <header className="App-header">
            <h1>MVVM React - Presentation Layer</h1>
            <p>Welcome to your MVVM React application!</p>

            <ExpenseTrackerView />
        </header>
        </div>
    )
}

export default App
