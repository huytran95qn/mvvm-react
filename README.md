1<div align="center">

# 🏛️ MVVM React Monorepo

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-orange.svg)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Architecture](https://img.shields.io/badge/architecture-Clean%20Architecture-blueviolet.svg)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

**A production-ready React monorepo implementing MVVM + Clean Architecture with custom Dependency Injection**

[Features](#-key-features) • [Architecture](#️-architecture-overview) • [Getting Started](#-getting-started) • [Documentation](#-layer-responsibilities) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

A modern, scalable React application showcasing **MVVM (Model-View-ViewModel)** architecture combined with **Clean Architecture** principles. Built as a monorepo using **pnpm workspaces**, featuring a custom Dependency Injection container, reactive data flow with RxJS, and full TypeScript type safety.

### ✨ What Makes This Project Special?

- 🎯 **Custom DI Container** - Built from scratch with TypeScript decorators
- 🔄 **Reactive Programming** - RxJS observables for elegant async handling
- 🏗️ **5-Layer Architecture** - Complete separation of concerns
- 📦 **Monorepo Structure** - Organized, scalable package management
- 🎨 **MVVM in React** - Clean separation between UI and business logic
- ✅ **Type-Safe** - Full TypeScript with strict mode

## 🏗️ Architecture Overview

This project implements a **5-layer Clean Architecture** with strict dependency rules, ensuring maintainability, testability, and scalability:

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                 🎨 Presentation Layer                        │
│         React Components • ViewModels • Hooks               │
└───────────────────────┬─────────────────────────────────────┘
                        │ uses
┌───────────────────────▼─────────────────────────────────────┐
│                 💼 Application Layer                         │
│              Use Cases • Business Rules                      │
└───────────────────────┬─────────────────────────────────────┘
                        │ depends on
┌───────────────────────▼─────────────────────────────────────┐
│                  🎯 Domain Layer                             │
│         Entities • Interfaces • Business Logic               │
└───────────────────────▲─────────────────────────────────────┘
                        │ implements
┌───────────────────────┴─────────────────────────────────────┐
│                🔧 Infrastructure Layer                       │
│      Repositories • APIs • External Services                 │
└─────────────────────────────────────────────────────────────┘
                        
┌─────────────────────────────────────────────────────────────┐
│                  ⚙️ Core Layer                               │
│      DI Container • Decorators • Shared Utilities            │
└─────────────────────────────────────────────────────────────┘
```

</div>

### 🔄 Data Flow

```
User Interaction → View → ViewModel → Use Case → Repository → API
                    ↓         ↓          ↓           ↓
                 Updates   Observes   Executes   Fetches
```

## 📦 Monorepo Structure

```
mvvm-react/
├── 📦 packages/
│   ├── ⚙️ Core/                    # Dependency Injection & Utilities
│   │   └── src/
│   │       ├── DI/                # Custom DI Container
│   │       │   ├── DIContainer.ts # Container implementation
│   │       │   ├── bind.ts        # Binding utilities
│   │       │   ├── get.ts         # Resolution utilities
│   │       │   └── unBind.ts      # Unbinding utilities
│   │       ├── Decorators/        # TypeScript Decorators
│   │       │   ├── @Injectable    # Class decorator
│   │       │   ├── @Inject        # Parameter decorator
│   │       │   └── InjectToken    # Injection token
│   │       └── Shared/            # Shared types & utilities
│   │
│   ├── 🎯 Domain/                  # Core Business Logic
│   │   ├── Entities/              # Business entities
│   │   │   └── ExpenseTracker     # Domain models
│   │   └── Repositories/          # Repository contracts
│   │       └── interfaces/        # Pure abstractions
│   │
│   ├── 💼 Application/             # Use Cases & Business Rules
│   │   └── src/
│   │       └── ExpenseTracker/    # Feature-specific use cases
│   │           ├── *.useCase.ts   # Business logic orchestration
│   │           └── *.interface.ts # Use case contracts
│   │
│   ├── 🔧 Infrastructure/          # External Integrations
│   │   └── src/
│   │       └── Repositories/      # Concrete implementations
│   │           ├── Base.repository.ts
│   │           └── ExpenseTracker/
│   │
│   └── 🎨 Presentation/            # React UI
│       └── src/
│           ├── Components/        # Reusable UI components
│           │   └── ViewModelProvider.tsx
│           ├── Hooks/             # Custom React hooks
│           │   ├── useObservable  # RxJS integration
│           │   └── useConstant    # Stable references
│           └── Pages/             # Feature pages
│               └── ExpenseTracker/
│                   ├── *.view.tsx      # React components
│                   └── *.viewModel.ts  # View logic
│
├── 📄 package.json               # Root workspace config
├── 📄 pnpm-workspace.yaml        # Workspace definition
└── 📄 tsconfig.base.json         # Shared TypeScript config
```

## 🎯 Key Features

### 1. **🔌 Custom Dependency Injection System**

A lightweight, decorator-based DI container built with InversifyJS and TypeScript metadata:

```typescript
// 1. Mark class as injectable
@Injectable()
export class ExpenseTrackerRepository implements IExpenseTrackerRepository {
    // Automatically registered in DI container
}

// 2. Inject dependencies via constructor
export class ExpensesTrackerUseCase {
    constructor(
        @Inject(EXPENSE_TRACKER_REPOSITORY_TOKEN)
        private readonly expenseTrackerRepository: IExpenseTrackerRepository
    ) {}
}

// 3. Resolve from container in React
function MyComponent() {
    const useCase = useInjector(ExpensesTrackerUseCase);
    // Use case is ready with all dependencies injected
}
```

**Benefits:**
- 🎯 Loose coupling between layers
- ✅ Easy unit testing with mocks
- 🔄 Runtime dependency resolution
- 📝 Type-safe injection with TypeScript

---

### 2. **🔄 Reactive Data Flow with RxJS**

Elegant handling of asynchronous operations using Observables:

```typescript
// Use case returns Observable
public getExpensesTrackersByGroup(): Observable<GroupedExpenses[]> {
    return this.expenseTrackerRepository.getAll().pipe(
        map(items => this.groupByCategory(items)),
        tap(data => console.log('Grouped:', data)),
        catchError(err => this.handleError(err))
    );
}

// React component subscribes
function ExpenseView() {
    const data = useObservable(() => 
        viewModel.getExpensesTrackersByGroup()
    );
    
    return <div>{data?.map(group => /* render */)}</div>;
}
```

**Advantages:**
- 🌊 Stream-based data processing
- 🎭 Powerful operators (map, filter, merge)
- ⚡ Automatic subscription management
- 🔄 Real-time updates support

---

### 3. **🏛️ Clean Architecture Principles**

Strict adherence to SOLID principles and dependency rules:

| Principle | Implementation |
|-----------|---------------|
| **Dependency Rule** | Inner layers never depend on outer layers |
| **Domain-Driven Design** | Business logic isolated in Domain |
| **Repository Pattern** | Abstract data access behind interfaces |
| **Use Case Pattern** | Each operation is a separate, testable use case |
| **Interface Segregation** | Small, focused interfaces per feature |

```typescript
// ✅ Good: Domain depends on nothing
export interface IExpenseTracker {
    id: string;
    amount: number;
}

// ✅ Good: Application depends on Domain
export class ExpensesTrackerUseCase {
    constructor(
        @Inject(REPOSITORY_TOKEN)
        private repo: IExpenseTrackerRepository // Domain interface
    ) {}
}

// ✅ Good: Infrastructure implements Domain
export class ExpenseTrackerRepository implements IExpenseTrackerRepository {
    // Concrete implementation
}
```

---

### 4. **💪 Full TypeScript Type Safety**

End-to-end type safety across all layers:

```typescript
// Generic DI Container
public get<T>(token: Newable<T>): T;
public get<T>(token: InjectionToken<T>): T;

// Type-safe injection tokens
export const EXPENSE_TRACKER_REPOSITORY_TOKEN = 
    new InjectionToken<IExpenseTrackerRepository>('ExpenseTrackerRepository');

// Strict typing in hooks
export function useObservable<State>(
    inputFactory: InputFactory<State>,
    initialState?: State
): State | null;
```

**Features:**
- 🔒 Strict mode enabled
- 📁 Path aliases for clean imports (`@Core`, `@Domain`)
- 🎯 Generic types throughout
- 🛡️ Compile-time error detection

---

### 5. **🎨 MVVM Pattern for React**

Clear separation between UI and business logic:

```typescript
// ViewModel: Business logic
export class ExpenseTrackerViewModel {
    constructor(
        @Inject(ExpensesTrackerUseCase)
        private useCase: IExpensesTrackerUseCase
    ) {}

    getExpenses() {
        return this.useCase.getExpensesTrackersByGroup();
    }
}

// View: Pure presentation
export function ExpenseTrackerView() {
    const viewModel = useInjector(ExpenseTrackerViewModel);
    const expenses = useObservable(() => viewModel.getExpenses());
    
    return <ExpenseList data={expenses} />;
}
```

**Benefits:**
- 🧪 ViewModels are easily testable
- 🎯 Views focus only on rendering
- 🔄 Reactive updates automatic
- 📦 Reusable business logic

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

| Tool | Version | Installation |
|------|---------|--------------|
| **Node.js** | >= 18.0.0 | [Download](https://nodejs.org/) |
| **pnpm** | Latest | `npm install -g pnpm` |

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/huytran95qn/mvvm-react.git
cd mvvm-react

# 2. Install all dependencies
pnpm install

# 3. Start development server
pnpm dev:presentation

# 4. Open browser
# Visit http://localhost:5173
```

### 📜 Available Scripts

#### Development
```bash
# Start Presentation layer (React app)
pnpm dev:presentation

# Start Core layer in watch mode
pnpm dev:core
```

#### Testing
```bash
# Run all tests
pnpm -w @mvvm-react/presentation run test

# Run tests in watch mode
pnpm -w @mvvm-react/presentation run test:watch

# Run tests with coverage
pnpm -w @mvvm-react/presentation run test:coverage
```

#### Building
```bash
# Build Presentation layer for production
pnpm -w @mvvm-react/presentation run build

# Preview production build
pnpm -w @mvvm-react/presentation run preview
```

#### Workspace Management
```bash
# Install package to specific workspace
pnpm add <package> --filter @mvvm-react/core

# Run script in specific workspace
pnpm --filter @mvvm-react/presentation run <script>

# Clean all node_modules
pnpm -r exec rm -rf node_modules
pnpm install
```

## 🔧 Technology Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-646cff?logo=vite)

### State Management & DI
![RxJS](https://img.shields.io/badge/RxJS-7.x-b7178c?logo=reactivex)
![InversifyJS](https://img.shields.io/badge/InversifyJS-6.x-orange)

### Build & Testing
![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220?logo=pnpm)
![Jest](https://img.shields.io/badge/Jest-29.x-c21325?logo=jest)
![Testing Library](https://img.shields.io/badge/Testing_Library-Latest-e33332?logo=testing-library)

</div>

### 📚 Core Dependencies

| Category | Technologies | Purpose |
|----------|-------------|---------|
| **UI Framework** | React 18, React DOM | Component-based UI |
| **Language** | TypeScript 5.6 | Type safety & DX |
| **Build Tool** | Vite | Fast dev server & bundling |
| **DI Container** | InversifyJS, reflect-metadata | Dependency injection |
| **Reactive** | RxJS 7.x | Asynchronous data streams |
| **Testing** | Jest, Testing Library | Unit & integration tests |
| **Monorepo** | pnpm workspaces | Package management |
| **Linting** | ESLint, Babel | Code quality |

## 📚 Layer Responsibilities

### ⚙️ **Core Layer** - Foundation

**Purpose:** Provide shared infrastructure and dependency injection

**Responsibilities:**
- ✅ Custom DI container implementation
- ✅ TypeScript decorators (`@Injectable`, `@Inject`)
- ✅ React integration hooks (`useInjector`)
- ✅ Shared types and utilities
- ✅ Cross-cutting concerns

**Key Files:**
- `DIContainer.ts` - IoC container
- `injectable.decorator.ts` - Class decorator
- `inject.decorator.ts` - Parameter decorator
- `InjectToken.ts` - Injection token factory

**Rules:**
- ❌ No dependencies on other layers
- ❌ No business logic
- ✅ Pure utilities only

---

### 🎯 **Domain Layer** - Business Core

**Purpose:** Define business entities and contracts

**Responsibilities:**
- ✅ Business entities (e.g., `ExpenseTracker`)
- ✅ Repository interfaces (contracts only)
- ✅ Pure domain logic
- ✅ Value objects and aggregates
- ✅ Domain events (future)

**Key Files:**
- `Entities/` - Domain models
- `Repositories/` - Interface definitions

**Rules:**
- ❌ No external dependencies (except Core types)
- ❌ No framework-specific code
- ❌ No infrastructure concerns
- ✅ Framework-agnostic
- ✅ Pure TypeScript/JavaScript

---

### 💼 **Application Layer** - Business Logic

**Purpose:** Orchestrate business operations via use cases

**Responsibilities:**
- ✅ Use case implementations
- ✅ Business rule validation
- ✅ Data transformation & aggregation
- ✅ Orchestration of domain objects
- ✅ Application-specific logic

**Key Files:**
- `*.useCase.ts` - Business operations
- `*.use-case.interface.ts` - Use case contracts

**Rules:**
- ✅ Depends on Domain layer only
- ✅ Receives dependencies via DI
- ❌ No UI concerns
- ❌ No direct infrastructure access

**Example:**
```typescript
export class ExpensesTrackerUseCase {
    constructor(
        @Inject(REPO_TOKEN)
        private repo: IExpenseTrackerRepository
    ) {}

    getExpensesTrackersByGroup(): Observable<GroupedExpenses[]> {
        return this.repo.getAll().pipe(
            map(items => this.groupByCategory(items))
        );
    }
}
```

---

### 🔧 **Infrastructure Layer** - External World

**Purpose:** Implement technical details and external integrations

**Responsibilities:**
- ✅ Repository implementations
- ✅ API client integrations
- ✅ Database access
- ✅ External service adapters
- ✅ File system operations

**Key Files:**
- `Repositories/` - Concrete implementations
- `Base.repository.ts` - Shared repository logic

**Rules:**
- ✅ Implements Domain interfaces
- ✅ Can use external libraries
- ❌ No business logic
- ✅ Handles technical concerns

**Example:**
```typescript
@Injectable()
export class ExpenseTrackerRepository implements IExpenseTrackerRepository {
    getAll(): Observable<ExpenseTracker[]> {
        return this.httpClient.get<ExpenseTracker[]>('/api/expenses');
    }
}
```

---

### 🎨 **Presentation Layer** - User Interface

**Purpose:** Handle user interactions and display data

**Responsibilities:**
- ✅ React components (Views)
- ✅ ViewModels for business logic
- ✅ Custom React hooks
- ✅ UI state management
- ✅ Event handling
- ✅ Component composition

**Key Files:**
- `Pages/` - Feature pages
- `Components/` - Reusable UI components
- `Hooks/` - Custom React hooks
- `*.view.tsx` - React components
- `*.viewModel.ts` - View logic

**Rules:**
- ✅ Uses Application layer (via DI)
- ✅ Purely presentational
- ❌ No direct domain/infrastructure access
- ✅ React-specific code only

**Example:**
```typescript
// ViewModel
export class ExpenseTrackerViewModel {
    constructor(
        @Inject(ExpensesTrackerUseCase)
        private useCase: IExpensesTrackerUseCase
    ) {}

    getExpenses() {
        return this.useCase.getExpensesTrackersByGroup();
    }
}

// View
export function ExpenseTrackerView() {
    const vm = useInjector(ExpenseTrackerViewModel);
    const data = useObservable(() => vm.getExpenses());
    
    return <div>{/* Render data */}</div>;
}
```

---

### 🔄 **Layer Dependencies**

```
Presentation  →  Application  →  Domain
                      ↓            ↑
                Infrastructure ────┘
                      ↓
                   Core (used by all)
```

**Dependency Rule:**
- ✅ Outer layers can depend on inner layers
- ❌ Inner layers cannot depend on outer layers
- ✅ All layers can use Core utilities

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

## 🧪 Testing Strategy

This project emphasizes testability through Clean Architecture and DI.

### Test Structure

```bash
packages/
├── Core/
│   └── __tests__/
│       ├── DIContainer.test.ts
│       └── decorators.test.ts
├── Application/
│   └── __tests__/
│       └── ExpensesTracker.useCase.test.ts
└── Presentation/
    └── src/
        ├── App.test.tsx
        └── __tests__/
            └── ExpenseTracker.view.test.tsx
```

### Running Tests

```bash
# Run all tests
pnpm -w @mvvm-react/presentation run test

# Run with coverage report
pnpm -w @mvvm-react/presentation run test:coverage

# Run in watch mode (TDD)
pnpm -w @mvvm-react/presentation run test:watch

# Run specific test file
pnpm test ExpenseTracker.test.tsx
```

### Testing Best Practices

#### ✅ Unit Testing Use Cases

```typescript
describe('ExpensesTrackerUseCase', () => {
    let useCase: ExpensesTrackerUseCase;
    let mockRepository: jest.Mocked<IExpenseTrackerRepository>;

    beforeEach(() => {
        // Mock dependencies
        mockRepository = {
            getAll: jest.fn()
        };

        // Create use case with mocks
        useCase = new ExpensesTrackerUseCase(mockRepository);
    });

    it('should group expenses by category', (done) => {
        // Arrange
        const mockData = [
            { id: '1', groupId: 'A', amount: 100 },
            { id: '2', groupId: 'A', amount: 200 }
        ];
        mockRepository.getAll.mockReturnValue(of(mockData));

        // Act & Assert
        useCase.getExpensesTrackersByGroup().subscribe(result => {
            expect(result).toHaveLength(1);
            expect(result[0].value).toHaveLength(2);
            done();
        });
    });
});
```

#### ✅ Testing React Components

```typescript
import { render, screen } from '@testing-library/react';

describe('ExpenseTrackerView', () => {
    it('should render expense list', () => {
        render(<ExpenseTrackerView />);
        expect(screen.getByText(/expenses/i)).toBeInTheDocument();
    });
});
```

### Test Coverage Goals

| Layer | Target Coverage |
|-------|----------------|
| **Core** | > 90% |
| **Domain** | > 95% |
| **Application** | > 85% |
| **Infrastructure** | > 70% |
| **Presentation** | > 80% |

## 🔑 Design Patterns & Principles

This project demonstrates multiple software engineering patterns:

### 🏗️ Architectural Patterns

| Pattern | Usage | Benefits |
|---------|-------|----------|
| **Clean Architecture** | 5-layer separation | Maintainability, testability |
| **MVVM** | View ↔ ViewModel ↔ Model | UI/logic separation |
| **Monorepo** | pnpm workspaces | Code sharing, consistency |
| **Layered Architecture** | Strict dependencies | Scalability, flexibility |

### 🎯 Design Patterns

| Pattern | Implementation | Location |
|---------|----------------|----------|
| **Dependency Injection** | Custom DI container | `Core/DI/` |
| **Repository Pattern** | Abstract data access | `Domain/Repositories/` |
| **Use Case Pattern** | Business operations | `Application/` |
| **Observer Pattern** | RxJS Observables | Throughout |
| **Decorator Pattern** | `@Injectable`, `@Inject` | `Core/Decorators/` |
| **Factory Pattern** | DI container | `DIContainer.ts` |
| **Adapter Pattern** | Repository implementations | `Infrastructure/` |
| **Provider Pattern** | React context | `ViewModelProvider.tsx` |

### 📐 SOLID Principles

✅ **Single Responsibility Principle**
- Each class has one reason to change
- Use cases handle single operations

✅ **Open/Closed Principle**
- Open for extension via interfaces
- Closed for modification

✅ **Liskov Substitution Principle**
- Implementations are swappable
- Mock repositories for testing

✅ **Interface Segregation Principle**
- Small, focused interfaces
- No fat interfaces

✅ **Dependency Inversion Principle**
- Depend on abstractions, not concretions
- High-level modules don't depend on low-level

### 🔄 Data Flow Patterns

```typescript
// Reactive data flow
Repository → Observable → UseCase → ViewModel → View
                ↓
         map/filter/tap
                ↓
           Transformed Data
```

### 🧩 Composition Patterns

```typescript
// Hooks composition
function useExpenseTracker() {
    const vm = useInjector(ExpenseTrackerViewModel);
    const data = useObservable(() => vm.getExpenses());
    return { data, isLoading: !data };
}
```

## 🗺️ Roadmap

### ✅ Phase 1 - Foundation (Completed)
- [x] Clean Architecture setup
- [x] Custom DI container
- [x] MVVM pattern implementation
- [x] Monorepo structure
- [x] TypeScript configuration
- [x] Basic expense tracker feature

### 🚧 Phase 2 - Enhancement (In Progress)
- [ ] Comprehensive test coverage (>80%)
- [ ] Error handling & boundaries
- [ ] Loading & error states
- [ ] API integration layer
- [ ] LocalStorage persistence
- [ ] Form validation

### 🔮 Phase 3 - Advanced Features (Planned)
- [ ] State management (Zustand/Redux)
- [ ] Routing (React Router)
- [ ] Authentication & authorization
- [ ] Multiple domain features
- [ ] Real-time updates (WebSocket)
- [ ] Internationalization (i18n)

### 🎨 Phase 4 - UI/UX (Planned)
- [ ] Design system implementation
- [ ] Component library (Storybook)
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Accessibility (WCAG AA)
- [ ] Animations & transitions

### 🚀 Phase 5 - Production Ready (Future)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Performance optimization
- [ ] E2E tests (Playwright)
- [ ] Monitoring & analytics
- [ ] Documentation site

### 💡 Future Considerations
- Server-Side Rendering (Next.js)
- Micro-frontends architecture
- GraphQL integration
- Progressive Web App (PWA)
- Mobile app (React Native)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/huytran95qn/mvvm-react.git
   cd mvvm-react
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide clear description
   - Reference related issues
   - Ensure CI passes

### Development Guidelines

#### Code Style
- ✅ Use TypeScript strict mode
- ✅ Follow ESLint rules
- ✅ Write meaningful commit messages
- ✅ Add JSDoc comments for public APIs

#### Testing
- ✅ Write unit tests for use cases
- ✅ Test React components
- ✅ Maintain >80% coverage
- ✅ Use descriptive test names

#### Architecture
- ✅ Follow Clean Architecture principles
- ✅ Respect layer boundaries
- ✅ Use dependency injection
- ✅ Keep components small & focused

### Areas for Contribution

🐛 **Bug Fixes**
- Fix existing issues
- Improve error handling
- Edge case handling

✨ **Features**
- New use cases
- UI components
- Integration adapters

📚 **Documentation**
- Improve README
- Add code examples
- Write tutorials

🧪 **Testing**
- Increase coverage
- Add E2E tests
- Performance tests

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Huy Tran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

### Inspiration & References

- 📖 **Clean Architecture** by Robert C. Martin
  - [Blog Series](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
  
- 🏛️ **Domain-Driven Design** by Eric Evans
  - Aggregate patterns and bounded contexts

- ⚛️ **React Documentation**
  - [Official React Docs](https://react.dev/)
  
- 🔄 **RxJS Documentation**
  - [Learn RxJS](https://www.learnrxjs.io/)

### Technologies & Libraries

Special thanks to the maintainers of:
- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [InversifyJS](https://inversify.io/) - DI container
- [RxJS](https://rxjs.dev/) - Reactive programming
- [Vite](https://vitejs.dev/) - Build tool
- [pnpm](https://pnpm.io/) - Package manager

### Community

Thanks to all contributors and the open-source community for inspiration and support! 💙

---

## 📞 Contact & Support

- **Author:** Huy Tran
- **GitHub:** [@huytran95qn](https://github.com/huytran95qn)
- **Repository:** [mvvm-react](https://github.com/huytran95qn/mvvm-react)

### Getting Help

- 🐛 [Report a Bug](https://github.com/huytran95qn/mvvm-react/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/huytran95qn/mvvm-react/issues/new?template=feature_request.md)
- 💬 [Discussions](https://github.com/huytran95qn/mvvm-react/discussions)

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐️ on GitHub!

<div align="center">

**[⬆ back to top](#-mvvm-react-monorepo)**

---

Made with ❤️ by [Huy Tran](https://github.com/huytran95qn)

**Happy Coding! 🚀**

</div>
