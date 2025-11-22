import { Newable } from "../Shared/newAble";
import { defaultDIStorage } from "../DI/DIContainer";
import { InjectionToken } from "../Decorators/InjectToken";

export function useInjector<T>(
    identifier: InjectionToken<T>
): T;
export function useInjector<T>(
    identifier: Newable<T>
): T;
export function useInjector<T>(
    identifier: any
): T {
    const instance = defaultDIStorage.get(identifier);

    if (!instance) {
        throw new Error(`No binding found for identifier: ${identifier.name}`);
    }

    return instance as T
}