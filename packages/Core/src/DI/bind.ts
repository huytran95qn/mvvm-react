import { Newable } from "inversify";
import { InjectionToken } from "../Decorators/InjectToken";

export function bind<T>(
    identifier: InjectionToken<T>
): void;
export function bind<T>(
    identifier: Newable<T>
): void;
export function bind<T>(
    identifier: any
): void {
    bind(identifier);
}