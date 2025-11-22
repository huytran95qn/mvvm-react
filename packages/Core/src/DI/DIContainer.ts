import "reflect-metadata";
import { Container } from "inversify"
import { INJECT_KEY } from "../Shared/injectKey";
import { Newable } from "../Shared/newAble";
import { InjectionToken } from "../Decorators/InjectToken";

export class DIContainer {
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
        if (this.container.isBound(token)) {
            return;
        }

        if (token instanceof InjectionToken) {
            if (token.implementation == null) {
                throw new Error(`No implementation provided for token: ${token.description}`);
            }

            this.container.bind<T>(token.description).toConstantValue(
                this.resolveDependencies(token.implementation)
            );
        } else if (typeof token === "function") {
            this.container.bind<T>(token).toConstantValue(
                this.resolveDependencies(implementation == null ? token : implementation)
            );
        }
    }

    private resolveDependencies<T>(identifier: Newable<T>): T {
        const params: Newable<T>[] = Reflect.getMetadata(INJECT_KEY, identifier) || [];
        
        return new identifier(...params.map(param => this.get(param)));
    }
}

export const defaultDIStorage = new DIContainer();