import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Tache } from '@app/interfaces/tache';



@Injectable({
    providedIn: 'root',
})
export class TacheService {
    private apiUrl = 'http://localhost:3000/taches';

    constructor(private http: HttpClient) { }

    getAllTache(): Observable<Tache[]> {
        return this.http.get<Tache[]>(this.apiUrl);
    }
    deleteTache(id: string): Observable<boolean> {
        const apiUrl = `http://localhost:3000/taches/${id}`;
        return this.http.delete(apiUrl).pipe(
            map(() => {
                console.log(` id ${id} deleted successfully.`);
                return true;
            }),
            catchError((error) => {
                console.error('Error deleting Tachee', error);
                return of(false); // Wrap the value in an observable
            })
        );
    }
    addTache(tache: Tache): Observable<Tache> {
        return this.http.post<Tache>(this.apiUrl, tache);
    }
    editTache(tache: Tache): Observable<Tache> {
        // const id = Number(Tache.id);
        return this.http.put<Tache>(`${this.apiUrl}/${tache.id}`, tache);
    }
}
