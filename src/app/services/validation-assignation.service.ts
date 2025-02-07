import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { ValidationAssignation } from '@app/interfaces/validationAssignation';

@Injectable({
  providedIn: 'root'
})
export class ValidationAssignationService {

  private apiUrl = 'http://localhost:3000/validationAssignation';

  constructor(private http: HttpClient) { }

  getAllValidationAssignation(): Observable<ValidationAssignation[]> {
    return this.http.get<ValidationAssignation[]>(this.apiUrl);
  }
  getAllByAssignation(idAssignation: string): Observable<ValidationAssignation[]> {
    return this.http.get<ValidationAssignation[]>(`${this.apiUrl}?idAssignation=${idAssignation}`).pipe(
      map((validationAssignation) => {
        return validationAssignation
      })
    );
  }
  deleteValidationAssignation(id: string): Observable<boolean> {
    const apiUrl = `http://localhost:3000/validationAssignation/${id}`;
    return this.http.delete(apiUrl).pipe(
      map(() => {
        console.log(` id ${id} deleted successfully.`);
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting ValidationAssignatione', error);
        return of(false); // Wrap the value in an observable
      })
    );
  }
  addValidationAssignation(validationAssignation: ValidationAssignation): Observable<ValidationAssignation> {
    return this.http.post<ValidationAssignation>(this.apiUrl, validationAssignation);
  }
  addMultiValidationAssignation(validationAssignations: ValidationAssignation[]): Observable<ValidationAssignation[]> {

    return forkJoin(
      validationAssignations.map((validation) =>
        this.http.post<ValidationAssignation>(this.apiUrl, validation)
      )
    );
  }
  editValidationAssignation(validationAssignation: ValidationAssignation): Observable<ValidationAssignation> {
    // const id = Number(ValidationAssignation.id);
    return this.http.put<ValidationAssignation>(`${this.apiUrl}/${validationAssignation.id}`, validationAssignation);
  }
}
