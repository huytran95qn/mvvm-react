# @mvvm-react/presentation

The **Presentation** package is the user interface layer of the application, built with React. It handles user interactions, displays data, and coordinates with the Application layer through use cases.

## 📦 What's Inside

This package contains:

- **React Components** - UI components and views
- **Hooks** - Custom React hooks for state and side effects
- **Styling** - CSS and styling solutions
- **UI State Management** - Local component state
- **User Event Handling** - Click handlers, form submissions, etc.

## 🏗️ Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Application styles
├── App.test.tsx         # Component tests
├── main.tsx             # Application entry point
├── index.css            # Global styles
├── setupTests.ts        # Test configuration
├── vite-env.d.ts        # Vite type definitions
└── __mocks__/           # Test mocks
    └── fileMock.ts      # File import mock
```

## 🎯 Key Principles

### 1. **Separation of Concerns**
- Components handle **only** UI rendering and user interaction
- Business logic lives in the Application layer (use cases)
- Data access is abstracted through repositories

### 2. **Dependency Injection**
Components access use cases via the `useInjector` hook:
```typescript
const useCase = useInjector(ExpensesTrackerUseCase);
```

### 3. **Reactive UI**
RxJS Observables drive UI updates:
```typescript
useEffect(() => {
    const subscription = useCase.getData().subscribe(setData);
    return () => subscription.unsubscribe();
}, [useCase]);
```

## 📚 Main Components

### App Component

The main application component that demonstrates the MVVM architecture.

```typescript
import { useInjector } from '@Core';
import { ExpensesTrackerUseCase } from '@Application/ExpenseTracker';
import { useEffect, useState } from 'react';
import { ExpenseTracker } from '@Domain/Entities/expenseTracker.entity';

function App() {
    const expenseTrackerUseCase = useInjector(ExpensesTrackerUseCase);
    const [state, setState] = useState<{
        id: string;
        value: ExpenseTracker[];
    }[]>();

    useEffect(() => {
        const subscription = expenseTrackerUseCase
            .getExpensesTrackersByGroup()
            .subscribe({
                next: groups => setState(groups),
                error: error => console.error('Error:', error)
            });

        return () => subscription.unsubscribe();
    }, [expenseTrackerUseCase]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>MVVM React - Presentation Layer</h1>
                <p>Welcome to your MVVM React application!</p>
                <div>{JSON.stringify(state)}</div>
            </header>
        </div>
    );
}

export default App;
```

**Key Features:**
- Uses `useInjector` to get use case instance
- Manages local UI state with `useState`
- Subscribes to Observable in `useEffect`
- Properly cleans up subscription on unmount

## 🚀 Getting Started

### Installation

```bash
# Install dependencies (from monorepo root)
pnpm install
```

### Development

```bash
# Start development server
pnpm dev:presentation

# Run on specific port
pnpm dev:presentation -- --port 3000
```

### Building

```bash
# Build for production
pnpm -w @mvvm-react/presentation run build

# Preview production build
pnpm -w @mvvm-react/presentation run preview
```

### Testing

```bash
# Run tests
pnpm -w @mvvm-react/presentation run test

# Run tests in watch mode
pnpm -w @mvvm-react/presentation run test:watch

# Run tests with coverage
pnpm -w @mvvm-react/presentation run test:coverage
```

### Linting

```bash
# Lint code
pnpm -w @mvvm-react/presentation run lint

# Fix linting issues
pnpm -w @mvvm-react/presentation run lint:fix
```

## 📋 Creating Components

### Basic Component with Use Case

```typescript
import { useInjector } from '@Core';
import { ProductUseCase } from '@Application/Product';
import { useState, useEffect } from 'react';

export function ProductList() {
    const productUseCase = useInjector(ProductUseCase);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const subscription = productUseCase
            .getAllProducts()
            .subscribe({
                next: (data) => {
                    setProducts(data);
                    setLoading(false);
                },
                error: (err) => {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => subscription.unsubscribe();
    }, [productUseCase]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>{product.name}</li>
            ))}
        </ul>
    );
}
```

### Custom Hook for Use Case

Create reusable hooks for common patterns:

```typescript
// hooks/useExpenseGroups.ts
import { useInjector } from '@Core';
import { ExpensesTrackerUseCase } from '@Application/ExpenseTracker';
import { useState, useEffect } from 'react';

export function useExpenseGroups() {
    const useCase = useInjector(ExpensesTrackerUseCase);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const subscription = useCase
            .getExpensesTrackersByGroup()
            .subscribe({
                next: (data) => {
                    setGroups(data);
                    setLoading(false);
                },
                error: (err) => {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => subscription.unsubscribe();
    }, [useCase]);

    return { groups, loading, error };
}

// Usage in component
function ExpenseList() {
    const { groups, loading, error } = useExpenseGroups();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error!</div>;

    return (
        <div>
            {groups.map(group => (
                <div key={group.id}>
                    <h3>{group.id}</h3>
                    {/* Render expenses */}
                </div>
            ))}
        </div>
    );
}
```

## 🎨 Styling

### CSS Modules (Recommended)

```typescript
// ExpenseCard.module.css
.card {
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
}

.title {
    font-size: 18px;
    font-weight: bold;
}

// ExpenseCard.tsx
import styles from './ExpenseCard.module.css';

export function ExpenseCard({ expense }) {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{expense.name}</h3>
        </div>
    );
}
```

### Global Styles

```css
/* index.css */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

## 🧪 Testing Components

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
    it('renders the application title', () => {
        render(<App />);
        const titleElement = screen.getByText(/MVVM React/i);
        expect(titleElement).toBeInTheDocument();
    });
});
```

### Testing with Use Cases

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { ProductList } from './ProductList';
import { of } from 'rxjs';

// Mock the useInjector hook
jest.mock('@Core', () => ({
    useInjector: jest.fn()
}));

describe('ProductList', () => {
    it('displays products when loaded', async () => {
        const mockUseCase = {
            getAllProducts: jest.fn(() => of([
                { id: '1', name: 'Product 1' },
                { id: '2', name: 'Product 2' }
            ]))
        };

        (useInjector as jest.Mock).mockReturnValue(mockUseCase);

        render(<ProductList />);

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });
    });

    it('displays loading state initially', () => {
        const mockUseCase = {
            getAllProducts: jest.fn(() => new Observable()) // Never emits
        };

        (useInjector as jest.Mock).mockReturnValue(mockUseCase);

        render(<ProductList />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
});
```

### Testing User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateExpenseForm } from './CreateExpenseForm';

describe('CreateExpenseForm', () => {
    it('submits form with user input', async () => {
        const mockOnSubmit = jest.fn();
        render(<CreateExpenseForm onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByLabelText(/name/i);
        const amountInput = screen.getByLabelText(/amount/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await userEvent.type(nameInput, 'Groceries');
        await userEvent.type(amountInput, '50');
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Groceries',
            amount: 50
        });
    });
});
```

## ✅ Best Practices

### 1. **Keep Components Simple**
```typescript
// ✅ Good - Focused component
function ExpenseItem({ expense }) {
    return (
        <div>
            <span>{expense.emoji}</span>
            <span>{expense.name}</span>
            <span>${expense.assigned}</span>
        </div>
    );
}

// ❌ Bad - Too many responsibilities
function ExpenseManager() {
    // Fetching data
    // Business logic
    // Multiple UI concerns
    // Form handling
}
```

### 2. **Use Custom Hooks for Reusable Logic**
```typescript
// ✅ Good - Reusable hook
function useExpenseData(id: string) {
    const useCase = useInjector(ExpenseUseCase);
    const [data, setData] = useState(null);
    
    useEffect(() => {
        const sub = useCase.getById(id).subscribe(setData);
        return () => sub.unsubscribe();
    }, [id, useCase]);
    
    return data;
}
```

### 3. **Handle Loading and Error States**
```typescript
function DataComponent() {
    const { data, loading, error } = useData();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!data) return <EmptyState />;

    return <DataDisplay data={data} />;
}
```

### 4. **Cleanup Subscriptions**
```typescript
// ✅ Good - Always cleanup
useEffect(() => {
    const subscription = useCase.getData().subscribe(setData);
    return () => subscription.unsubscribe();
}, [useCase]);

// ❌ Bad - Memory leak
useEffect(() => {
    useCase.getData().subscribe(setData);
    // No cleanup!
}, [useCase]);
```

### 5. **Memoize Expensive Computations**
```typescript
import { useMemo } from 'react';

function ExpenseAnalytics({ expenses }) {
    const total = useMemo(
        () => expenses.reduce((sum, e) => sum + e.amount, 0),
        [expenses]
    );

    return <div>Total: ${total}</div>;
}
```

## 🔧 Configuration

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@Core': '/packages/Core/src',
            '@Application': '/packages/Application/src'
        }
    },
    server: {
        port: 3000
    }
});
```

### TypeScript Configuration

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "jsx": "react-jsx",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "paths": {
            "@Core": ["../Core/src"],
            "@Application/*": ["../Application/src/*"]
        }
    }
}
```

## 🔗 Dependencies

### Production Dependencies
- **react** ^18.3.1 - UI library
- **react-dom** ^18.3.1 - React DOM renderer

### Development Dependencies
- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **typescript** - Type checking
- **jest** - Testing framework
- **@testing-library/react** - React testing utilities
- **eslint** - Code linting

## 📚 Related Packages

- **@mvvm-react/core** - Provides `useInjector` hook
- **@mvvm-react/application** - Use cases consumed by components
- **@mvvm-react/domain** - Entity types used in UI

## 🎓 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Testing Library Documentation](https://testing-library.com/react)
- [RxJS Documentation](https://rxjs.dev)

---

The Presentation layer is where users interact with your application. Keep it simple, testable, and focused on the user experience!
