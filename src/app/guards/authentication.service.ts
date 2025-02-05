import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@interfaces/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:3000/users';
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map((users) => {
        if (users.length > 0 && this.isLocalStorageAvailable) {
          // localStorage.setItem('authToken', users[0].authToken); // Save token to localStorage
          localStorage.setItem("connectedUser", JSON.stringify(users[0])); // Save token to localStorage
          return true;
        }
        return false;
      })
    );
  }

  isAuthenticated(): boolean {
    if (this.isLocalStorageAvailable) {
      const isConnected = localStorage.getItem('connectedUser');
      return !!isConnected;
    }
    return false
  }
  checkRole(role: string): boolean {
    if (this.isLocalStorageAvailable) {
      const connectedUser = localStorage.getItem('connectedUser');
      const check = connectedUser ? JSON.parse(connectedUser).idRole?.toLowerCase() === role.toLowerCase() : false;
      return check;
    }
    return false
  }

  logout(): void {
    localStorage.removeItem('connectedUser');
  }
}
