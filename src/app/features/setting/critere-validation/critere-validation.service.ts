import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { CritereValidation } from '@app/interfaces/critereValidation';



@Injectable({
    providedIn: 'root',
})
export class CritereValidationService {
    private apiUrl = 'http://localhost:3000/critereValidations';

    constructor(private http: HttpClient) { }

    getAllCritereValidation(): Observable<CritereValidation[]> {
        return this.http.get<CritereValidation[]>(this.apiUrl);
    }
    deleteCritereValidation(id: string): Observable<boolean> {
        const apiUrl = `http://localhost:3000/critereValidations/${id}`;
        return this.http.delete(apiUrl).pipe(
            map(() => {
                console.log(` id ${id} deleted successfully.`);
                return true;
            }),
            catchError((error) => {
                console.error('Error deleting CritereValidatione', error);
                return of(false); // Wrap the value in an observable
            })
        );
    }
    addCritereValidation(critereValidation: CritereValidation): Observable<CritereValidation> {
        return this.http.post<CritereValidation>(this.apiUrl, critereValidation);
    }
    editCritereValidation(critereValidation: CritereValidation): Observable<CritereValidation> {
        // const id = Number(CritereValidation.id);
        return this.http.put<CritereValidation>(`${this.apiUrl}/${critereValidation.id}`, critereValidation);
    }
}
