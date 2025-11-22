import { Newable } from "inversify";
import { defaultDIStorage } from "./DIContainer";
import { InjectionToken } from "../Decorators/InjectToken";

export function unBind<T>(
    identifier: InjectionToken<T>
): void;
export function unBind<T>(
    identifier: Newable<T>
): void;
export function unBind<T>(
    identifier: any
): void {
    defaultDIStorage.unbind<T>(identifier);
}