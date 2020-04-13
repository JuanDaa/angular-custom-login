import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private  API_URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private  API_KEY = 'AIzaSyBKb36Y_y2QfjAJG-VX5xQTAKuAj7hZZ4s';

  userToken: string;

  // Create new user
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]


  // Login
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]


  constructor( private http: HttpClient ) {
    this.readToken();
  }


  static logout() {
    localStorage.removeItem('token');
  }

  login( user: UserModel ) {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.API_URL }/verifyPassword?key=${ this.API_KEY }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken'] );
        return resp;
      })
    );

  }

  newUser(user: UserModel ) {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.API_URL }/signupNewUser?key=${ this.API_KEY }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken'] );
        return resp;
      })
    );

  }


  private saveToken( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let toDay = new Date();
    toDay.setSeconds( 3600 );

    localStorage.setItem('expira', toDay.getTime().toString() );


  }

  readToken() {

    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;

  }


  isAuthenticated(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expiration = Number(localStorage.getItem('expira'));
    const expirationDate = new Date();
    expirationDate.setTime(expiration);
    return expirationDate > new Date();


  }


}
