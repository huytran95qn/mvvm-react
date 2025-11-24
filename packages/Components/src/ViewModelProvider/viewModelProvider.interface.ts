import { Newable } from "@Core";

export interface ViewModelProviderProps<T> {
    viewModel: Newable<T>;
    children: React.ReactNode;
}
