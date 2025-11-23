import { BehaviorSubject, Observable, tap } from "rxjs"
import useConstant from "./useConstant"
import { useEffect, useMemo, useSyncExternalStore } from "react"

export type InputFactory<State> = (state$: Observable<State>) => Observable<State>

export function useObservable<State>(
    inputFactory: InputFactory<State>,
    initialState?: State
): State | null {
    const state$ = useConstant(() => new BehaviorSubject<State | undefined>(initialState));

    useEffect(() => {
        return () => {
            state$.complete();
        } 
    });

    const subscription = useMemo(() => {
        const $output = (
            inputFactory as unknown as (state$: Observable<State | undefined>) => Observable<State>
        )(state$);

        return (onstorageChange: () => void) => {
            const subscription = $output.pipe(
                tap(s => state$.next(s))
            ).subscribe(onstorageChange);

            return () => subscription.unsubscribe();
        }
    }, []);

    const getSnapShot = useMemo(() => {
        return () => state$.getValue() ?? null
    }, []);

    return useSyncExternalStore(subscription, getSnapShot, getSnapShot);
}