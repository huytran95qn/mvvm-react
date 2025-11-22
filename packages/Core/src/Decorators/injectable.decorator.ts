import { InjectionToken } from "./InjectToken";

export function Injectable() {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        const params = Reflect.getMetadata(
            "design:paramtypes",
            constructor
        ) as Array<InjectionToken<any>>;
        Reflect.defineMetadata(
            "design:paramtypes",
            params,
            constructor
        );

        return constructor;
    };
}