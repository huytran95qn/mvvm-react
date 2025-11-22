import { Newable, get } from "@Core";
import { useState, useEffect } from "react";
import { Observable } from "rxjs";

export function useViewModel<T, R>(
    ViewModelClass: Newable<T>,
    selector: (vm: T) => Observable<R>
): R | undefined {
    const [viewModel] = useState(() => get(ViewModelClass));
    const [state, setState] = useState<R>();

    useEffect(() => {
        const subscription = selector(viewModel).subscribe(setState);
        return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewModel]);

    return state;
}