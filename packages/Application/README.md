# @mvvm-react/application

The **Application** package contains the business logic layer of the application, implementing use cases that orchestrate domain entities and coordinate between layers.

## 📦 What's Inside

This package contains:

- **Use Cases** - Application-specific business operations
- **Business Logic Orchestration** - Coordinate between repositories and entities
- **Data Transformation** - Convert data for presentation needs
- **Application Services** - Stateless business operations

## 🏗️ Structure

```
src/
└── ExpenseTracker/
    ├── ExpensesTracker.use-case.interface.ts  # Use case contract
    ├── ExpensesTracker.useCase.ts             # Use case implementation
    └── index.ts                               # Exports
```

## 🎯 Key Principles

### 1. **Orchestration Layer**
Use cases orchestrate operations across:
- Domain entities
- Repository interfaces
- Business rules
- Data transformations

### 2. **Framework Independence**
Use cases are independent of:
- UI frameworks (React, Vue, etc.)
- Infrastructure details (databases, APIs)
- External services

### 3. **Single Responsibility**
Each use case handles **one** business operation or workflow.

## 📚 Use Cases

### ExpensesTrackerUseCase

Manages expense tracking business operations, including grouping expenses by category.

#### Interface

```typescript
export interface IExpensesTrackerUseCase {
    getExpensesTrackersByGroup(): Observable<{
        id: string;
        value: ExpenseTracker[];
    }[]>;
}
```

#### Implementation

```typescript
import { Inject } from '@Core';
import { IExpenseTrackerRepository } from '@Domain/Repositories/ExpenseTracker';
import { ExpenseTracker } from '@Domain/Entities/expenseTracker.entity';
import { map, Observable } from 'rxjs';
import { EXPENSE_TRACKER_REPOSITORY_TOKEN } from '@Repositories/ExpenseTracker';

@Injectable()
export class ExpensesTrackerUseCase implements IExpensesTrackerUseCase {
    constructor(
        @Inject(EXPENSE_TRACKER_REPOSITORY_TOKEN)
        private readonly expenseTrackerRepository: IExpenseTrackerRepository
    ) {}

    public getExpensesTrackersByGroup(): Observable<{
        id: string;
        value: ExpenseTracker[];
    }[]> {
        return this.expenseTrackerRepository.getAll().pipe(
            map(items => items.reduce((groups, item) => {
                const found = groups.find(g => g.id === item.groupId);

                if (found) {
                    found.value.push(item);
                } else {
                    groups.push({
                        id: item.groupId,
                        value: [item]
                    });
                }

                return groups;
            }, [] as { id: string; value: ExpenseTracker[] }[]))
        );
    }
}
```

**What it does:**
1. Retrieves all expense trackers from repository
2. Groups them by `groupId`
3. Returns grouped structure for presentation

## 🚀 Usage

### In Presentation Layer (React)

```typescript
import { useInjector } from '@Core';
import { ExpensesTrackerUseCase } from '@Application/ExpenseTracker';

function ExpenseTrackerComponent() {
    const expenseUseCase = useInjector(ExpensesTrackerUseCase);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const subscription = expenseUseCase
            .getExpensesTrackersByGroup()
            .subscribe({
                next: (groupedExpenses) => setGroups(groupedExpenses),
                error: (error) => console.error(error)
            });

        return () => subscription.unsubscribe();
    }, [expenseUseCase]);

    return (
        <div>
            {groups.map(group => (
                <div key={group.id}>
                    <h3>Group: {group.id}</h3>
                    {group.value.map(expense => (
                        <div key={expense.id}>{expense.name}</div>
                    ))}
                </div>
            ))}
        </div>
    );
}
```

### In Tests

```typescript
import { of } from 'rxjs';
import { ExpensesTrackerUseCase } from './ExpensesTracker.useCase';

describe('ExpensesTrackerUseCase', () => {
    let useCase: ExpensesTrackerUseCase;
    let mockRepository: jest.Mocked<IExpenseTrackerRepository>;

    beforeEach(() => {
        mockRepository = {
            getAll: jest.fn()
        };
        
        useCase = new ExpensesTrackerUseCase(mockRepository);
    });

    it('should group expenses by groupId', (done) => {
        const mockExpenses = [
            { groupId: 'food', id: '1', name: 'Groceries', /* ... */ },
            { groupId: 'food', id: '2', name: 'Restaurant', /* ... */ },
            { groupId: 'transport', id: '3', name: 'Gas', /* ... */ }
        ];

        mockRepository.getAll.mockReturnValue(of(mockExpenses));

        useCase.getExpensesTrackersByGroup().subscribe(groups => {
            expect(groups).toHaveLength(2);
            expect(groups[0].id).toBe('food');
            expect(groups[0].value).toHaveLength(2);
            expect(groups[1].id).toBe('transport');
            expect(groups[1].value).toHaveLength(1);
            done();
        });
    });
});
```

## 📋 Creating New Use Cases

### Step 1: Define the Interface

```typescript
// src/User/User.use-case.interface.ts
import { User } from '@Domain/Entities/user.entity';
import { Observable } from 'rxjs';

export interface IUserUseCase {
    getActiveUsers(): Observable<User[]>;
    activateUser(userId: string): Observable<User>;
}
```

### Step 2: Implement the Use Case

```typescript
// src/User/User.useCase.ts
import { Inject, Injectable } from '@Core';
import { IUserRepository } from '@Domain/Repositories/User';
import { USER_REPOSITORY_TOKEN } from '@Repositories/User';
import { map, Observable } from 'rxjs';

@Injectable()
export class UserUseCase implements IUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) {}

    public getActiveUsers(): Observable<User[]> {
        return this.userRepository.getAll().pipe(
            map(users => users.filter(user => user.isActive))
        );
    }

    public activateUser(userId: string): Observable<User> {
        return this.userRepository.update(userId, { isActive: true });
    }
}
```

### Step 3: Export from Index

```typescript
// src/User/index.ts
export type { IUserUseCase } from './User.use-case.interface';
export { UserUseCase } from './User.useCase';
```

## 🎨 Design Patterns

### Use Case Pattern
Each use case represents a single business operation:
- Clear input and output
- Single responsibility
- Testable in isolation

### Dependency Injection
Use cases receive dependencies via constructor:
- Loose coupling
- Easy to mock for testing
- Follows dependency rule

### Observable Pattern
RxJS Observables for asynchronous operations:
- Composable data streams
- Error handling
- Cancellation support

## ✅ Best Practices

### 1. **One Use Case Per Business Operation**
```typescript
// ✅ Good - Focused use case
class GetUserProfileUseCase {
    execute(userId: string): Observable<UserProfile> { }
}

// ❌ Bad - Too many responsibilities
class UserUseCase {
    getProfile() { }
    updateProfile() { }
    deleteUser() { }
    sendEmail() { }
}
```

### 2. **Use RxJS Operators for Transformations**
```typescript
// ✅ Good - Declarative transformation
return this.repository.getAll().pipe(
    map(items => this.groupByCategory(items)),
    catchError(error => this.handleError(error))
);

// ❌ Bad - Imperative transformation
return new Observable(subscriber => {
    this.repository.getAll().subscribe(items => {
        const grouped = this.groupByCategory(items);
        subscriber.next(grouped);
    });
});
```

### 3. **Depend on Interfaces, Not Implementations**
```typescript
// ✅ Good - Depends on interface
constructor(
    @Inject(REPOSITORY_TOKEN)
    private repository: IRepository
) {}

// ❌ Bad - Depends on concrete class
constructor(
    private repository: ConcreteRepository
) {}
```

### 4. **Keep Use Cases Stateless**
```typescript
// ✅ Good - Stateless operation
public getExpenses(): Observable<Expense[]> {
    return this.repository.getAll();
}

// ❌ Bad - Stateful use case
private cachedData: Expense[];
public getExpenses(): Observable<Expense[]> {
    if (this.cachedData) return of(this.cachedData);
    // ...
}
```

### 5. **Handle Errors Appropriately**
```typescript
public getData(): Observable<Data[]> {
    return this.repository.getAll().pipe(
        catchError(error => {
            console.error('Failed to fetch data:', error);
            return of([]); // Return empty array as fallback
        })
    );
}
```

## 🔗 Dependencies

- **@mvvm-react/core** - DI decorators and utilities
- **@mvvm-react/domain** - Entities and repository interfaces
- **@mvvm-react/infrastructure** - Repository tokens (for injection)
- **rxjs** - Reactive programming

## 🧪 Testing Strategy

### Unit Tests
Test use cases in isolation with mocked repositories:

```typescript
describe('ExpensesTrackerUseCase', () => {
    let useCase: ExpensesTrackerUseCase;
    let mockRepo: jest.Mocked<IExpenseTrackerRepository>;

    beforeEach(() => {
        mockRepo = { getAll: jest.fn() };
        useCase = new ExpensesTrackerUseCase(mockRepo);
    });

    it('should transform data correctly', () => {
        // Arrange
        mockRepo.getAll.mockReturnValue(of(mockData));

        // Act & Assert
        useCase.getExpensesTrackersByGroup().subscribe(result => {
            expect(result).toMatchSnapshot();
        });
    });
});
```

### Integration Tests
Test with real repositories (in-memory or test database):

```typescript
it('should work with real repository', () => {
    const realRepo = new InMemoryExpenseRepository();
    const useCase = new ExpensesTrackerUseCase(realRepo);
    
    // Test with real data flow
});
```

## 📊 Common Use Case Patterns

### 1. **Query Use Case** (Read Operations)
```typescript
@Injectable()
export class GetExpensesUseCase {
    public execute(): Observable<Expense[]> {
        return this.repository.getAll();
    }
}
```

### 2. **Command Use Case** (Write Operations)
```typescript
@Injectable()
export class CreateExpenseUseCase {
    public execute(data: CreateExpenseDto): Observable<Expense> {
        const expense = new Expense(data);
        return this.repository.create(expense);
    }
}
```

### 3. **Transformation Use Case**
```typescript
@Injectable()
export class GroupExpensesUseCase {
    public execute(): Observable<GroupedExpenses[]> {
        return this.repository.getAll().pipe(
            map(items => this.groupByCategory(items))
        );
    }
}
```

## 📚 Related Packages

- **@mvvm-react/domain** - Provides entities and interfaces used by use cases
- **@mvvm-react/infrastructure** - Implements repositories injected into use cases
- **@mvvm-react/presentation** - Consumes use cases via `useInjector`
- **@mvvm-react/core** - Provides DI infrastructure

---

Use cases represent the **business intent** of your application. They should be clear, focused, and testable.
