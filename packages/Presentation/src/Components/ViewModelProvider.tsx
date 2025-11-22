import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Newable, get, unBind } from "@Core";

interface ViewModelProviderProps<T> {
    viewModel: Newable<T>;
    children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViewModelContext = createContext<any>(null);

export function ViewModelProvider<T>({ 
    viewModel, 
    children 
}: ViewModelProviderProps<T>): React.JSX.Element {
    const instance = useMemo(() => {
        return get(viewModel);
    }, [viewModel]);

    useEffect(() => {
        return () => {
            unBind(viewModel);
        };
    }, [viewModel]);

    return (
        <ViewModelContext.Provider value={instance}>
            {children}
        </ViewModelContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProvidedViewModel<T>(): T {
    const viewModel = useContext(ViewModelContext);

    if (!viewModel) {
        throw new Error("useProvidedViewModel must be used within ViewModelProvider");
    }

    return viewModel;
}