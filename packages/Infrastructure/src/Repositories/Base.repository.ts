import { from, Observable, switchMap } from "rxjs";

export abstract class BaseRepository {
    private baseUri: string = "http://localhost:3000";

    protected get<T>(endpoint: string): Observable<T[]> {
        return from(fetch(`${this.baseUri}/${endpoint}`)).pipe(
            switchMap(response => response.json()),
        );
    }
}