import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environment';
import { LoginResponse, User } from '../models/login.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _apiUrl = apiUrl;
  private _user: BehaviorSubject<User | null>;

  constructor(private _http: HttpClient, private _router: Router) {
    // Almacenamos el usuario.
    // Usamos behaviorSubject porque por defecto podemos darle un valor.
    this._user = new BehaviorSubject<User | null>(null);
  }

  get user(): Observable<User | null> {
    return this._user.asObservable();
  }
  //Al iniciar la aplicacion comprobamos si hay un usuario en local storage.
  setUser(user: User) {
    this._user.next(user);
  }

  async login(email: string, password: string): Promise<User> {
    // Post porque es un metodo Post en Postman.
    return new Promise<User>((resolve, reject) => {
      this._http
        .post<LoginResponse>(this._apiUrl + '/login', {
          email: email,
          password: password,
        })
        .subscribe({
          next: (value) => {
            // Almacenamos el usuario.
            this._user.next(value.data.data.user);
            localStorage.setItem('user', JSON.stringify(value.data.data.user));
            this._router.navigateByUrl('/home');
            resolve(value.data.data.user);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }
}
