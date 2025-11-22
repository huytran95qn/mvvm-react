1# MVVM React Monorepo

A modern React application implementing **MVVM (Model-View-ViewModel)** architecture with **Clean Architecture** principles, built as a monorepo using **pnpm workspaces**.

## 🏗️ Architecture Overview

This project follows a layered architecture approach, ensuring separation of concerns, testability, and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│              (React Components + Hooks)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │ uses
┌───────────────────────▼─────────────────────────────────────┐
│                   Application Layer                          │
│                  (Use Cases / Business Logic)                │
└───────────────────────┬─────────────────────────────────────┘
                        │ depends on
┌───────────────────────▼─────────────────────────────────────┐
│                     Domain Layer                             │
│            (Entities + Repository Interfaces)                │
└───────────────────────▲─────────────────────────────────────┘
                        │ implements
┌───────────────────────┴─────────────────────────────────────┐
│                  Infrastructure Layer                        │
│            (Repository Implementations + APIs)               │
└─────────────────────────────────────────────────────────────┘
                        
┌─────────────────────────────────────────────────────────────┐
│                       Core Layer                             │
│         (DI Container, Decorators, Shared Utilities)         │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Monorepo Structure

```
packages/
├── Core/                      # Dependency Injection & Core utilities
│   └── src/
│       ├── DI/               # DI Container & useInjector hook
│       ├── Decorators/       # @Injectable, @Inject decorators
│       └── Shared/           # Shared types and utilities
│
├── Domain/                    # Business entities & interfaces
│   ├── Entities/             # Domain models (ExpenseTracker)
│   └── Repositories/         # Repository interfaces (contracts)
│
├── Application/              # Use cases & business logic
│   └── src/
│       └── ExpenseTracker/   # ExpenseTracker use cases
│
├── Infrastructure/           # External implementations
│   └── src/
│       └── Repositories/     # Concrete repository implementations
│
└── Presentation/             # React UI layer
    └── src/
        ├── App.tsx          # Main application component
        └── main.tsx         # Application entry point
```

## 🎯 Key Features

### 1. **Dependency Injection System**
Custom DI container built on top of InversifyJS with TypeScript decorators:

```typescript
@Injectable()
export class ExpenseTrackerRepository implements IExpenseTrackerRepository {
    // Auto-registered on class definition
}

export class ExpensesTrackerUseCase {
    constructor(
        @Inject(EXPENSE_TRACKER_REPOSITORY_TOKEN)
        private readonly expenseTrackerRepository: IExpenseTrackerRepository
    ) {}
}
```

### 2. **Reactive Data Flow**
RxJS-based reactive patterns for asynchronous data handling:

```typescript
public getExpensesTrackersByGroup(): Observable<{
    id: string,
    value: ExpenseTracker[]
}[]> {
    return this.expenseTrackerRepository.getAll().pipe(
        map(items => /* transformation logic */)
    );
}
```

### 3. **Clean Architecture Principles**
- **Dependency Rule**: Inner layers don't depend on outer layers
- **Domain-Driven Design**: Business logic isolated in Domain layer
- **Repository Pattern**: Abstract data access behind interfaces
- **Use Case Pattern**: Each business operation is a separate use case

### 4. **Type Safety**
Full TypeScript implementation with:
- Strict mode enabled
- Path aliases for clean imports
- Interface-based contracts
- Generic type support in DI container

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- pnpm (recommended package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev:presentation
```

### Development Scripts

```bash
# Start Presentation layer in dev mode
pnpm dev:presentation

# Start Core layer in dev mode
pnpm dev:core

# Run tests
pnpm -w @mvvm-react/presentation run test

# Run tests in watch mode
pnpm -w @mvvm-react/presentation run test:watch

# Build for production
pnpm -w @mvvm-react/presentation run build
```

## 🔧 Technology Stack

### Core Technologies
- **React 18** - UI library
- **TypeScript 5.6** - Type-safe development
- **Vite** - Fast build tool and dev server
- **pnpm** - Efficient package management

### Architecture & Patterns
- **InversifyJS** - IoC container
- **reflect-metadata** - Decorator metadata
- **RxJS** - Reactive programming
- **Clean Architecture** - Layered design

### Development Tools
- **Jest** - Unit testing framework
- **Testing Library** - React component testing
- **ESLint** - Code linting
- **Babel** - JavaScript transpilation

## 📚 Layer Responsibilities

### **Core Layer**
- Dependency Injection container
- Custom decorators (`@Injectable`, `@Inject`)
- React integration (`useInjector` hook)
- Shared types and utilities

### **Domain Layer**
- Business entities (e.g., `ExpenseTracker`)
- Repository interfaces (contracts)
- Pure business logic (no external dependencies)

### **Application Layer**
- Use cases that orchestrate business logic
- Application-specific business rules
- Data transformation and aggregation

### **Infrastructure Layer**
- Repository implementations
- External API integrations
- Data persistence logic
- Third-party service integrations

### **Presentation Layer**
- React components and views
- UI state management
- User interaction handling
- Component composition

## 🏃 Usage Example

### 1. Define Domain Entity
```typescript
export interface IExpenseTracker {
    id: string;
    name: string;
    assigned: number;
}

export class ExpenseTracker implements IExpenseTracker {
    // Entity implementation
}
```

### 2. Create Repository Interface (Domain)
```typescript
export interface IExpenseTrackerRepository {
    getAll(): Observable<ExpenseTracker[]>;
}
```

### 3. Implement Repository (Infrastructure)
```typescript
@Injectable()
export class ExpenseTrackerRepository implements IExpenseTrackerRepository {
    public getAll(): Observable<ExpenseTracker[]> {
        return this.get("expenses");
    }
}
```

### 4. Create Use Case (Application)
```typescript
export class ExpensesTrackerUseCase {
    constructor(
        @Inject(EXPENSE_TRACKER_REPOSITORY_TOKEN)
        private readonly expenseTrackerRepository: IExpenseTrackerRepository
    ) {}

    public getExpensesTrackersByGroup(): Observable<GroupedExpenses[]> {
        return this.expenseTrackerRepository.getAll().pipe(
            map(items => this.groupByCategory(items))
        );
    }
}
```

### 5. Use in React Component (Presentation)
```typescript
function App() {
    const expenseTrackerUseCase = useInjector(ExpensesTrackerUseCase);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const subscription = expenseTrackerUseCase
            .getExpensesTrackersByGroup()
            .subscribe(data => setGroups(data));

        return () => subscription.unsubscribe();
    }, [expenseTrackerUseCase]);

    return <div>{/* Render groups */}</div>;
}
```

## 🧪 Testing

The project includes Jest and React Testing Library for comprehensive testing:

```bash
# Run all tests
pnpm -w @mvvm-react/presentation run test

# Run tests with coverage
pnpm -w @mvvm-react/presentation run test:coverage

# Run tests in watch mode
pnpm -w @mvvm-react/presentation run test:watch
```

## 🔑 Design Patterns Used

- **Dependency Injection** - Loose coupling and testability
- **Repository Pattern** - Abstract data access
- **Use Case Pattern** - Encapsulate business operations
- **Observer Pattern** - RxJS Observables for reactive data
- **Decorator Pattern** - Metadata for DI container
- **Factory Pattern** - DI container creates instances

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Clean Architecture principles by Robert C. Martin
- MVVM pattern adapted for React ecosystem
- Built with modern TypeScript best practices

---

**Note**: This is a demonstration project showcasing MVVM architecture in React. It can be extended with additional features like state management, routing, authentication, and more complex business logic.
