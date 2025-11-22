# @mvvm-react/infrastructure

The **Infrastructure** package provides concrete implementations of repository interfaces, external service integrations, and data persistence logic.

## 📦 What's Inside

This package contains:

- **Repository Implementations** - Concrete implementations of Domain repository interfaces
- **External APIs** - HTTP clients, third-party service integrations
- **Data Access** - Database connections, ORM configurations
- **Infrastructure Services** - File systems, caching, logging

## 🏗️ Structure

```
src/
├── Repositories/
│   ├── Base.repository.ts              # Base repository with common functionality
│   ├── index.ts                        # Repository exports
│   └── ExpenseTracker/
│       ├── ExpenseTracker.repository.ts       # Implementation
│       ├── ExpenseTracker.repository.token.ts # DI token
│       └── index.ts                           # Exports
└── Shared/
    └── (shared infrastructure utilities)
```

## 🎯 Key Principles

### 1. **Implements Domain Contracts**
All repositories implement interfaces defined in the Domain layer.

### 2. **External Dependencies**
This is the **only** layer that should:
- Make HTTP requests
- Access databases
- Interact with file systems
- Call third-party APIs

### 3. **Technology Specific**
Contains framework and library-specific code:
- Fetch API
- Database drivers
- ORM configurations

## 📚 Repositories

### BaseRepository

Provides common functionality for all repositories.

```typescript
import { from, Observable, switchMap } from 'rxjs';

export abstract class BaseRepository {
    private baseUri: string = "http://localhost:3000";

    protected get<T>(endpoint: string): Observable<T[]> {
        return from(fetch(`${this.baseUri}/${endpoint}`)).pipe(
            switchMap(response => response.json())
        );
    }
}
```

**Features:**
- Centralized API base URL configuration
- RxJS Observable wrapper around Fetch API
- Type-safe generic methods
- Extendable for common repository operations

### ExpenseTrackerRepository

Implements `IExpenseTrackerRepository` from Domain layer.

```typescript
import { Observable } from 'rxjs';
import { Injectable } from '@Core';
import { BaseRepository } from '../Base.repository';
import { ExpenseTracker } from '@Domain/Entities/expenseTracker.entity';
import { IExpenseTrackerRepository } from '@Domain/Repositories/ExpenseTracker';

@Injectable()
export class ExpenseTrackerRepository
    extends BaseRepository
    implements IExpenseTrackerRepository {
    
    public getAll(): Observable<ExpenseTracker[]> {
        return super.get("expenses");
    }
}
```

**Key Points:**
- Marked with `@Injectable()` for DI
- Extends `BaseRepository` for shared functionality
- Implements Domain interface
- Simple, focused implementation

### Injection Tokens

Each repository has an associated injection token for DI.

```typescript
import { InjectionToken } from '@Core';
import { IExpenseTrackerRepository } from '@Domain/Repositories/ExpenseTracker';
import { ExpenseTrackerRepository } from './ExpenseTracker.repository';

export const EXPENSE_TRACKER_REPOSITORY_TOKEN = 
    new InjectionToken<IExpenseTrackerRepository>(
        'IExpenseTrackerRepository',
        ExpenseTrackerRepository
    );
```

**Usage in Application Layer:**
```typescript
import { EXPENSE_TRACKER_REPOSITORY_TOKEN } from '@Repositories/ExpenseTracker';

@Injectable()
export class MyUseCase {
    constructor(
        @Inject(EXPENSE_TRACKER_REPOSITORY_TOKEN)
        private repository: IExpenseTrackerRepository
    ) {}
}
```

## 🚀 Usage

### Basic Repository Usage

```typescript
import { ExpenseTrackerRepository } from '@Repositories/ExpenseTracker';

const repository = new ExpenseTrackerRepository();

repository.getAll().subscribe({
    next: (expenses) => console.log('Expenses:', expenses),
    error: (error) => console.error('Error:', error),
    complete: () => console.log('Complete')
});
```

### With Dependency Injection

```typescript
import { Inject } from '@Core';
import { EXPENSE_TRACKER_REPOSITORY_TOKEN } from '@Repositories/ExpenseTracker';

@Injectable()
export class MyService {
    constructor(
        @Inject(EXPENSE_TRACKER_REPOSITORY_TOKEN)
        private repository: IExpenseTrackerRepository
    ) {}

    loadData() {
        return this.repository.getAll();
    }
}
```

## 📋 Creating New Repositories

### Step 1: Define Interface in Domain Layer

```typescript
// packages/Domain/Repositories/Product/Product.repository.interface.ts
import { Product } from '@Domain/Entities/product.entity';
import { Observable } from 'rxjs';

export interface IProductRepository {
    getAll(): Observable<Product[]>;
    getById(id: string): Observable<Product>;
    create(product: Product): Observable<Product>;
    update(id: string, product: Partial<Product>): Observable<Product>;
    delete(id: string): Observable<void>;
}
```

### Step 2: Create Repository Implementation

```typescript
// src/Repositories/Product/Product.repository.ts
import { Injectable } from '@Core';
import { BaseRepository } from '../Base.repository';
import { Product } from '@Domain/Entities/product.entity';
import { IProductRepository } from '@Domain/Repositories/Product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductRepository 
    extends BaseRepository 
    implements IProductRepository {
    
    public getAll(): Observable<Product[]> {
        return super.get<Product>('products');
    }

    public getById(id: string): Observable<Product> {
        return super.get<Product>(`products/${id}`).pipe(
            map(products => products[0])
        );
    }

    public create(product: Product): Observable<Product> {
        return from(fetch(`${this.baseUri}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })).pipe(
            switchMap(response => response.json())
        );
    }

    public update(id: string, product: Partial<Product>): Observable<Product> {
        return from(fetch(`${this.baseUri}/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })).pipe(
            switchMap(response => response.json())
        );
    }

    public delete(id: string): Observable<void> {
        return from(fetch(`${this.baseUri}/products/${id}`, {
            method: 'DELETE'
        })).pipe(
            map(() => void 0)
        );
    }
}
```

### Step 3: Create Injection Token

```typescript
// src/Repositories/Product/Product.repository.token.ts
import { InjectionToken } from '@Core';
import { IProductRepository } from '@Domain/Repositories/Product';
import { ProductRepository } from './Product.repository';

export const PRODUCT_REPOSITORY_TOKEN = 
    new InjectionToken<IProductRepository>(
        'IProductRepository',
        ProductRepository
    );
```

### Step 4: Export from Index

```typescript
// src/Repositories/Product/index.ts
export { ProductRepository } from './Product.repository';
export { PRODUCT_REPOSITORY_TOKEN } from './Product.repository.token';
```

```typescript
// src/Repositories/index.ts
export * from './Product';
```

## 🎨 Design Patterns

### Repository Pattern
Encapsulates data access logic:
- Collection-like interface
- Hides persistence details
- Enables easy testing with mocks

### Adapter Pattern
Adapts external APIs to domain interfaces:
- Fetch API → Repository interface
- External format → Domain entities

### Template Method Pattern
`BaseRepository` provides common functionality:
- Subclasses override specific methods
- Shared configuration and utilities

## ✅ Best Practices

### 1. **Error Handling**
```typescript
public getAll(): Observable<Product[]> {
    return super.get<Product>('products').pipe(
        catchError(error => {
            console.error('Failed to fetch products:', error);
            return throwError(() => new Error('Product fetch failed'));
        })
    );
}
```

### 2. **Data Mapping**
```typescript
public getAll(): Observable<Product[]> {
    return super.get<ProductDto>('products').pipe(
        map(dtos => dtos.map(dto => this.mapToEntity(dto)))
    );
}

private mapToEntity(dto: ProductDto): Product {
    return new Product({
        id: dto.productId,
        name: dto.productName,
        // Map DTO fields to entity
    });
}
```

### 3. **Retry Logic**
```typescript
import { retry, delay } from 'rxjs/operators';

public getAll(): Observable<Product[]> {
    return super.get<Product>('products').pipe(
        retry({
            count: 3,
            delay: 1000
        })
    );
}
```

### 4. **Caching**
```typescript
export class ProductRepository extends BaseRepository {
    private cache: Map<string, Product> = new Map();

    public getById(id: string): Observable<Product> {
        if (this.cache.has(id)) {
            return of(this.cache.get(id)!);
        }

        return super.get<Product>(`products/${id}`).pipe(
            map(products => products[0]),
            tap(product => this.cache.set(id, product))
        );
    }
}
```

### 5. **Type Safety**
```typescript
// Define API response types
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

// Use generics for type safety
protected get<T>(endpoint: string): Observable<T[]> {
    return from(fetch(`${this.baseUri}/${endpoint}`)).pipe(
        switchMap(response => response.json() as Promise<ApiResponse<T[]>>),
        map(apiResponse => apiResponse.data)
    );
}
```

## 🔧 Extending BaseRepository

Add common methods for all repositories:

```typescript
export abstract class BaseRepository {
    protected baseUri: string = "http://localhost:3000";

    protected get<T>(endpoint: string): Observable<T[]> {
        return from(fetch(`${this.baseUri}/${endpoint}`)).pipe(
            switchMap(response => response.json())
        );
    }

    protected post<T>(endpoint: string, data: any): Observable<T> {
        return from(fetch(`${this.baseUri}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })).pipe(
            switchMap(response => response.json())
        );
    }

    protected put<T>(endpoint: string, data: any): Observable<T> {
        return from(fetch(`${this.baseUri}/${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })).pipe(
            switchMap(response => response.json())
        );
    }

    protected delete(endpoint: string): Observable<void> {
        return from(fetch(`${this.baseUri}/${endpoint}`, {
            method: 'DELETE'
        })).pipe(
            map(() => void 0)
        );
    }
}
```

## 🧪 Testing Repositories

### Unit Tests (Mocked Fetch)
```typescript
describe('ExpenseTrackerRepository', () => {
    let repository: ExpenseTrackerRepository;

    beforeEach(() => {
        repository = new ExpenseTrackerRepository();
        global.fetch = jest.fn();
    });

    it('should fetch expenses', (done) => {
        const mockExpenses = [{ id: '1', name: 'Test' }];
        
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => mockExpenses
        });

        repository.getAll().subscribe(expenses => {
            expect(expenses).toEqual(mockExpenses);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/expenses'
            );
            done();
        });
    });
});
```

### Integration Tests (Real API)
```typescript
describe('ExpenseTrackerRepository Integration', () => {
    let repository: ExpenseTrackerRepository;

    beforeAll(() => {
        repository = new ExpenseTrackerRepository();
    });

    it('should fetch real expenses from API', (done) => {
        repository.getAll().subscribe({
            next: (expenses) => {
                expect(Array.isArray(expenses)).toBe(true);
                done();
            },
            error: done.fail
        });
    }, 10000); // Longer timeout for real API
});
```

## 🔗 Dependencies

- **@mvvm-react/core** - DI decorators
- **@mvvm-react/domain** - Entity types and interfaces
- **rxjs** - Reactive programming
- **fetch API** - HTTP requests (built-in)

## 📊 Alternative Implementations

### With Axios
```typescript
import axios from 'axios';

export class AxiosBaseRepository {
    protected baseUri = 'http://localhost:3000';

    protected get<T>(endpoint: string): Observable<T[]> {
        return from(axios.get<T[]>(`${this.baseUri}/${endpoint}`)).pipe(
            map(response => response.data)
        );
    }
}
```

### With GraphQL
```typescript
import { gql } from 'graphql-request';

export class GraphQLRepository {
    protected client: GraphQLClient;

    public getAll(): Observable<Product[]> {
        const query = gql`
            query {
                products {
                    id
                    name
                }
            }
        `;

        return from(this.client.request(query)).pipe(
            map(data => data.products)
        );
    }
}
```

## 📚 Related Packages

- **@mvvm-react/domain** - Defines repository interfaces
- **@mvvm-react/application** - Consumes repositories via DI
- **@mvvm-react/core** - Provides DI infrastructure

---

The Infrastructure layer is where your application meets the outside world. Keep it flexible and replaceable!
