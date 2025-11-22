# @mvvm-react/core

The **Core** package provides the foundational infrastructure for dependency injection, decorators, and shared utilities used across all layers of the application.

## 📦 What's Inside

This package contains the core building blocks that enable clean architecture and dependency injection throughout the monorepo.

### Key Components

- **Dependency Injection Container** - Custom DI system built on InversifyJS
- **Decorators** - TypeScript decorators for DI (`@Injectable`, `@Inject`)
- **React Integration** - `useInjector` hook for accessing DI container in React
- **Injection Tokens** - Token-based dependency registration
- **Shared Types** - Common type definitions

## 🏗️ Structure

```
src/
├── DI/
│   ├── DIContainer.ts           # Core DI container implementation
│   └── useInjector.ts           # React hook for DI
├── Decorators/
│   ├── inject.decorator.ts      # @Inject decorator
│   ├── injectable.decorator.ts  # @Injectable decorator
│   └── InjectToken.ts           # Token system for DI
└── Shared/
    ├── injectKey.ts             # Metadata key for injection
    └── newAble.ts               # Type for constructable classes
```

## 🚀 Usage

### 1. Injectable Decorator

Mark classes as injectable to automatically register them with the DI container:

```typescript
import { Injectable } from '@Core';

@Injectable()
export class MyService {
    // Service implementation
}
```

With token registration:

```typescript
import { Injectable, InjectionToken } from '@Core';

export const MY_SERVICE_TOKEN = new InjectionToken<IMyService>(
    'IMyService',
    MyServiceImpl
);

@Injectable(MY_SERVICE_TOKEN)
export class MyServiceImpl implements IMyService {
    // Implementation
}
```

### 2. Inject Decorator

Inject dependencies into constructor parameters:

```typescript
import { Inject, Injectable } from '@Core';

@Injectable()
export class UserUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) {}
}
```

### 3. useInjector Hook

Access dependencies in React components:

```typescript
import { useInjector } from '@Core';
import { UserUseCase } from '@Application/User';

function UserComponent() {
    const userUseCase = useInjector(UserUseCase);
    
    // Use the injected use case
    useEffect(() => {
        const subscription = userUseCase
            .getUsers()
            .subscribe(users => setUsers(users));
        
        return () => subscription.unsubscribe();
    }, [userUseCase]);
}
```

### 4. Injection Tokens

Create tokens for interface-based injection:

```typescript
import { InjectionToken } from '@Core';

// Define token with implementation
export const LOGGER_TOKEN = new InjectionToken<ILogger>(
    'ILogger',
    ConsoleLogger
);

// Or define token and set implementation later
export const API_TOKEN = new InjectionToken<IApiClient>('IApiClient')
    .withImplementation(HttpApiClient);
```

## 🔧 API Reference

### DIContainer

The core dependency injection container.

```typescript
class DIContainer {
    // Get instance from container
    get<T>(token: Newable<T> | InjectionToken<T>): T
    
    // Register binding
    bind<T>(token: InjectionToken<T>, implementation: Newable<T>): void
    bind<T>(token: Newable<T>): void
}

// Default container instance
export const defaultDIStorage: DIContainer;
```

### @Injectable(token?)

Class decorator that registers the class with the DI container.

**Parameters:**
- `token` (optional): `InjectionToken<T>` - Token to associate with this class

**Example:**
```typescript
@Injectable()
export class SimpleService {}

@Injectable(SERVICE_TOKEN)
export class TokenizedService {}
```

### @Inject(token)

Parameter decorator that marks constructor parameters for injection.

**Parameters:**
- `token`: `Newable<T> | InjectionToken<T>` - The dependency to inject

**Example:**
```typescript
constructor(
    @Inject(MyService) private service: MyService,
    @Inject(API_TOKEN) private api: IApiClient
) {}
```

### useInjector<T>(identifier)

React hook to retrieve instances from the DI container.

**Parameters:**
- `identifier`: `Newable<T> | InjectionToken<T>` - Class or token to resolve

**Returns:** `T` - The resolved instance

**Example:**
```typescript
const service = useInjector(MyService);
const api = useInjector(API_TOKEN);
```

### InjectionToken<T>

Token class for interface-based dependency injection.

```typescript
class InjectionToken<T> {
    constructor(description: string, implementation?: Newable<T>)
    
    // Set implementation after creation
    withImplementation(impl: Newable<T>): this
    
    // Get the implementation class
    get implementation(): Newable<T> | undefined
}
```

## 📋 Requirements

- TypeScript 5.6+
- `experimentalDecorators: true` in tsconfig.json
- `emitDecoratorMetadata: true` in tsconfig.json
- `reflect-metadata` package

## 🔗 Dependencies

- **inversify** - IoC container
- **reflect-metadata** - Decorator metadata support

## 💡 Design Patterns

- **Dependency Injection** - Inversion of Control pattern
- **Decorator Pattern** - Metadata attachment via decorators
- **Factory Pattern** - Container creates instances
- **Singleton Pattern** - Single container instance

## 🎯 Best Practices

1. **Use tokens for interfaces** - Always use `InjectionToken` when injecting interfaces
2. **Constructor injection** - Prefer constructor injection over property injection
3. **Single responsibility** - Keep injectable classes focused on one concern
4. **Avoid circular dependencies** - Structure dependencies in a DAG
5. **Mark dependencies explicitly** - Always use `@Inject` decorator for clarity

## ⚠️ Important Notes

- The `@Inject` decorator can **only** be used on constructor parameters
- Classes marked with `@Injectable` are automatically registered on definition
- The default DI container (`defaultDIStorage`) is shared across the application
- Dependencies are resolved eagerly when requested

## 🔍 Example Workflow

```typescript
// 1. Define interface
export interface IDataService {
    getData(): Observable<Data[]>;
}

// 2. Create token
export const DATA_SERVICE_TOKEN = new InjectionToken<IDataService>(
    'IDataService',
    DataServiceImpl
);

// 3. Implement with @Injectable
@Injectable(DATA_SERVICE_TOKEN)
export class DataServiceImpl implements IDataService {
    getData(): Observable<Data[]> {
        return of([/* data */]);
    }
}

// 4. Inject into use case
@Injectable()
export class DataUseCase {
    constructor(
        @Inject(DATA_SERVICE_TOKEN)
        private dataService: IDataService
    ) {}
}

// 5. Use in React
function MyComponent() {
    const useCase = useInjector(DataUseCase);
    // ... use the use case
}
```

## 📚 Related Packages

- **@mvvm-react/application** - Use cases that consume Core DI
- **@mvvm-react/infrastructure** - Repositories registered via Core
- **@mvvm-react/presentation** - React components using `useInjector`

---

This package is the foundation of the MVVM architecture, enabling loose coupling and testability across all layers.
