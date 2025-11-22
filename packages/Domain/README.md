# @mvvm-react/domain

The **Domain** package represents the core business layer of the application. It contains business entities and repository interfaces, defining the contracts that other layers must follow.

## 📦 What's Inside

This package is the heart of the application, containing:

- **Entities** - Business models representing domain concepts
- **Repository Interfaces** - Contracts for data access (no implementations)
- **Business Rules** - Pure domain logic (no external dependencies)

## 🏗️ Structure

```
├── Entities/
│   ├── expenseTracker.entity.ts   # ExpenseTracker entity
│   └── index.ts                   # Entity exports
└── Repositories/
    └── ExpenseTracker/
        ├── ExpenseTracker.repository.interface.ts
        └── index.ts
```

## 🎯 Key Principles

### 1. **Dependency Rule**
The Domain layer has **NO dependencies** on other layers. It defines interfaces that outer layers implement.

### 2. **Pure Business Logic**
All code in this layer represents business concepts, free from:
- Framework dependencies
- Infrastructure concerns (databases, APIs)
- UI logic

### 3. **Interface Segregation**
Repository interfaces define only the methods needed for business operations.

## 📚 Entities

### ExpenseTracker

Represents an expense tracking item with group association.

```typescript
export interface IExpenseTracker {
    groupId: string;      // Group identifier
    groupName: string;    // Group display name
    id: string;           // Unique identifier
    name: string;         // Expense name
    emoji: string;        // Visual identifier
    assigned: number;     // Assigned amount
    activity: number;     // Activity level
}

export class ExpenseTracker implements IExpenseTracker {
    public groupId: string = "";
    public groupName: string = "";
    public id: string = "";
    public name: string = "";
    public emoji: string = "";
    public assigned: number = 0;
    public activity: number = 0;

    constructor(data?: IExpenseTracker) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
```

**Usage:**
```typescript
import { ExpenseTracker } from '@Domain/Entities/expenseTracker.entity';

const expense = new ExpenseTracker({
    id: '1',
    name: 'Groceries',
    emoji: '🛒',
    assigned: 500,
    activity: 450,
    groupId: 'food',
    groupName: 'Food & Dining'
});
```

## 🔌 Repository Interfaces

### IExpenseTrackerRepository

Defines the contract for accessing expense tracker data.

```typescript
export interface IExpenseTrackerRepository {
    getAll(): Observable<ExpenseTracker[]>;
}
```

**Key Points:**
- Returns `Observable` for reactive data flow
- Interface only - no implementation details
- Used by Application layer
- Implemented by Infrastructure layer

**Example Contract:**
```typescript
import { IExpenseTrackerRepository } from '@Domain/Repositories/ExpenseTracker';
import { ExpenseTracker } from '@Domain/Entities/expenseTracker.entity';
import { Observable } from 'rxjs';

// Application layer depends on this interface
class MyUseCase {
    constructor(
        private repository: IExpenseTrackerRepository
    ) {}
    
    loadData(): Observable<ExpenseTracker[]> {
        return this.repository.getAll();
    }
}

// Infrastructure layer implements this interface
class ExpenseTrackerRepositoryImpl implements IExpenseTrackerRepository {
    getAll(): Observable<ExpenseTracker[]> {
        // Implementation details here
    }
}
```

## 📋 Adding New Entities

When adding a new business entity:

1. **Create the entity file:**
```typescript
// Entities/user.entity.ts
export interface IUser {
    id: string;
    name: string;
    email: string;
}

export class User implements IUser {
    public id: string = "";
    public name: string = "";
    public email: string = "";

    constructor(data?: IUser) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
```

2. **Export from index:**
```typescript
// Entities/index.ts
export type { User } from "./user.entity";
```

## 📋 Adding New Repository Interfaces

When adding a new repository interface:

1. **Create the interface file:**
```typescript
// Repositories/User/User.repository.interface.ts
import { User } from '@Domain/Entities/user.entity';
import { Observable } from 'rxjs';

export interface IUserRepository {
    getAll(): Observable<User[]>;
    getById(id: string): Observable<User>;
    create(user: User): Observable<User>;
    update(id: string, user: Partial<User>): Observable<User>;
    delete(id: string): Observable<void>;
}
```

2. **Export from index:**
```typescript
// Repositories/User/index.ts
export type { IUserRepository } from './User.repository.interface';
```

## 🎨 Design Patterns

### Entity Pattern
Entities encapsulate business data and behavior:
- Represent domain concepts
- Contain business rules
- Independent of persistence mechanism

### Repository Pattern
Repositories abstract data access:
- Interface in Domain layer
- Implementation in Infrastructure layer
- Provides collection-like API

## ✅ Best Practices

1. **Keep entities simple** - Focus on data and business rules
2. **No external dependencies** - Domain should be self-contained
3. **Use interfaces for repositories** - Never implement here
4. **Immutability when possible** - Consider readonly properties
5. **Validation in entities** - Enforce business invariants
6. **Value objects** - Consider creating for complex values

## 🚫 What NOT to Include

❌ Framework-specific code (React, Express, etc.)  
❌ Database models or ORM entities  
❌ API client implementations  
❌ UI components or view logic  
❌ Infrastructure concerns  
❌ External library dependencies (except core JS/TS)

## ✅ What TO Include

✅ Business entities and value objects  
✅ Repository interfaces (contracts)  
✅ Domain events  
✅ Business validation rules  
✅ Domain-specific types and enums  
✅ Pure business logic functions

## 🔗 Dependencies

This package should have **minimal dependencies**:
- `rxjs` - For Observable return types in repository interfaces
- TypeScript core types only

## 📊 Testing

Domain entities and interfaces are easy to test:

```typescript
describe('ExpenseTracker', () => {
    it('should create an expense with default values', () => {
        const expense = new ExpenseTracker();
        
        expect(expense.id).toBe("");
        expect(expense.assigned).toBe(0);
    });
    
    it('should create an expense with provided data', () => {
        const expense = new ExpenseTracker({
            id: '1',
            name: 'Test',
            assigned: 100,
            activity: 50,
            // ... other fields
        });
        
        expect(expense.id).toBe('1');
        expect(expense.assigned).toBe(100);
    });
});
```

## 📚 Related Packages

- **@mvvm-react/application** - Uses Domain entities and interfaces
- **@mvvm-react/infrastructure** - Implements Domain repository interfaces
- **@mvvm-react/core** - Provides DI infrastructure (no direct dependency)

## 🎓 Learning Resources

- **Domain-Driven Design** by Eric Evans
- **Clean Architecture** by Robert C. Martin
- **Repository Pattern** - Martin Fowler's catalog

---

The Domain layer is the most stable layer in the architecture. Changes here should be driven by business requirements, not technical concerns.
