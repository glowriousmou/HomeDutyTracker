import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Assignation } from '@app/interfaces/assignation';



@Injectable({
    providedIn: 'root',
})
export class AssignationService {
    private apiUrl = 'http://localhost:3000/assignations';

    constructor(private http: HttpClient) { }

    getAllAssignation(): Observable<Assignation[]> {
        return this.http.get<Assignation[]>(this.apiUrl);
    }
    deleteAssignation(id: string): Observable<boolean> {
        const apiUrl = `http://localhost:3000/assignations/${id}`;
        return this.http.delete(apiUrl).pipe(
            map(() => {
                console.log(` id ${id} deleted successfully.`);
                return true;
            }),
            catchError((error) => {
                console.error('Error deleting Assignatione', error);
                return of(false); // Wrap the value in an observable
            })
        );
    }
    addAssignation(assignation: Assignation): Observable<Assignation> {
        return this.http.post<Assignation>(this.apiUrl, assignation);
    }
    editAssignation(assignation: Assignation): Observable<Assignation> {
        // const id = Number(Assignation.id);
        return this.http.put<Assignation>(`${this.apiUrl}/${assignation.id}`, assignation);
    }
}
