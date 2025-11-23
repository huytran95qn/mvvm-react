import "reflect-metadata";
import { Container } from "inversify"
import { INJECT_KEY } from "../Shared/injectKey";
import { Newable } from "../Shared/newAble";
import { InjectionToken } from "../Decorators/InjectToken";

class DIContainer {
    private readonly container = new Container();

    public get<T>(token: Newable<T>): T;
    public get<T>(token: InjectionToken<T>): T
    public get<T>(token: any): T {
        if (!this.container.isBound(token)) {
            this.bind<T>(token);
        }

        if (token instanceof InjectionToken) {
            return this.container.get<T>(token.description);
        }

        return this.container.get<T>(token);
    }

    public bind<T>(token: InjectionToken<T>, implementation: Newable<T>): void;
    public bind<T>(token: Newable<T>): void;
    public bind<T>(token: any, implementation?: Newable<T>): void {
        if (token instanceof InjectionToken) {
            const injectToken = token as InjectionToken<T>;

            if (this.container.isBound(injectToken.description)) {
                return;
            }

            if (token.implementation == null) {
                throw new Error(`No implementation provided for token: ${token.description}`);
            }

            this.container.bind<T>(token.description).toConstantValue(
                this.resolveDependencies(token.implementation)
            );
        } else if (typeof token === "function") {
            const newAbleToken = token as Newable<T>;

            this.container.bind<T>(newAbleToken).toConstantValue(
                this.resolveDependencies(implementation == null ? newAbleToken : implementation)
            );
        }
    }

    public unbind<T>(identifier: InjectionToken<T>): void;
    public unbind<T>(identifier: Newable<T>): void;
    public unbind<T>(identifier: any): void {
        if (identifier instanceof InjectionToken) {
            const injectToken = identifier as InjectionToken<T>;

            this.container.unbind(injectToken.description);
            return;
        }
        
        const newAbleToken = identifier as Newable<T>;

        if (this.container.isBound(newAbleToken)) {
            this.container.unbind(newAbleToken);
        }
    }

    private resolveDependencies<T>(identifier: Newable<T>): T {
        const params: Newable<T>[] = Reflect.getMetadata(INJECT_KEY, identifier) || [];
        
        return new identifier(...params.map(param => this.get(param)));
    }
}

export const defaultDIStorage = new DIContainer();