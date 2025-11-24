import React, { useEffect, useMemo } from "react";
import { getInstance, unBind } from "@Core";
import { ViewModelContext } from "../Shared/viewModel.context";
import { ViewModelProviderProps } from "./viewModelProvider.interface";

export function ViewModelProvider<T>({ 
    viewModel, 
    children 
}: ViewModelProviderProps<T>): React.JSX.Element {
    const instance = useMemo(() => {
        return getInstance(viewModel);
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