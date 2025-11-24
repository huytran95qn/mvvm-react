import { useContext } from "react";
import { ViewModelContext } from "../Shared/viewModel.context";
import { Newable } from "@Core";

export function useViewModel<T>(token: Newable<T>): T {
    const viewModel = useContext(ViewModelContext);

    if (!viewModel) {
        throw new Error("useViewModel must be used within ViewModelProvider");
    }

    if (viewModel instanceof token) {
        return viewModel;
    }

    throw new Error(`ViewModel of type ${token.name} not found in context`);
}