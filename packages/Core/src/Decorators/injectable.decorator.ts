import { defaultDIStorage } from "../DI/DIContainer";
import { InjectionToken } from "./InjectToken";

export function Injectable<T>(token?: InjectionToken<T>) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        // Auto-register on class definition
        if (token) {
            defaultDIStorage.bind(
                token,
                constructor as any
            );
        } else {
            defaultDIStorage.bind(
                constructor as any,
                constructor as any
            );
        }
        return constructor;
    };
}