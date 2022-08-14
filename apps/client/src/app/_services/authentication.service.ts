/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { HttpService } from '.';
import { User } from '../_models';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  isLogin = false;

  private tokenSubject: BehaviorSubject<any>;
  public tokenSubject$: Observable<string>;

  private userSubject: BehaviorSubject<any>;
  public userSubject$: Observable<User>;


  constructor(
    private httpService: HttpService
  ) {
    let user: any = {};

    this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem('token') || '');
    this.tokenSubject$ = this.tokenSubject.asObservable();

    try {
      user = JSON.parse(localStorage.getItem('user') || '{}')
    } catch (e) { }
    this.userSubject = new BehaviorSubject<User>(user);
    this.userSubject$ = this.userSubject.asObservable();
  }
  public get token(): any {
    return this.tokenSubject.value;
  }

  public get userData(): any {
    return this.userSubject.value;
  }

  public setToken(token: string) {
    this.tokenSubject.next(token);
  }


  generateToken(username: string, password: string): Observable<User> {
    const params = {
      username: username,
      password: password
    };

    return this.httpService.post('auth/login', params)
      .pipe(map((user: User) => {
        return user;
      }));
  }

  setUserData(user: User) {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    userData.isLoggedIn = true;
    userData.userid = user.id;
    userData.name = user.firstName + " " + user.lastName;
    userData.username = user.username;

    localStorage.setItem('token', user['token']);
    this.setToken(user['token']);

    localStorage.setItem('user', JSON.stringify(userData));
    this.userSubject.next(userData);
    return userData;
  }

  isLoggedIn() {
    let user: any = {};
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) { }
    if (user?.isLoggedIn)
      this.isLogin = true;
    else
      this.isLogin = false;
    return this.isLogin;
  }

  logout(): Observable<any> {
    return this.httpService.delete('auth/logout')
      .pipe(map((response) => {
        this.clearCache();
        return response;
      }));
  }

  logoutOnSessionExpire(): Observable<any> {
    this.clearCache();
    return of(true);
  }

  clearCache() {
    localStorage.clear();
    this.userSubject.next(null);
  }
}
