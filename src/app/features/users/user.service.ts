import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { User } from '@interfaces/user';


@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) { }

    getAllUser(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }
    deleteUser(id: string): Observable<boolean> {
        const apiUrl = `http://localhost:3000/users/${id}`;
        return this.http.delete(apiUrl).pipe(
            map(() => {
                console.log(` id ${id} deleted successfully.`);
                return true;
            }),
            catchError((error) => {
                console.error('Error deleting Usere', error);
                return of(false); // Wrap the value in an observable
            })
        );
    }
    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }
    editUser(user: User): Observable<User> {
        // const id = Number(User.id);
        return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
    }
}
