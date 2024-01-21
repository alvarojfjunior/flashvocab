import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(private afs: AngularFireAuth) {
    this.user$ = this.afs.authState;
  }

  signInWithGoogle() {
    return this.afs.signInWithPopup(new GoogleAuthProvider());
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.afs.signInWithEmailAndPassword(email, password);
  }

  registerWithEmailAndPassword(user: { email: string; password: string }) {
    return this.afs.createUserWithEmailAndPassword(user.email, user.password);
  }

  signOut() {
    return this.afs.signOut();
  }

  isLoggedIn(): Observable<boolean> {
    return this.afs.authState.pipe(map((user) => !!user));
  }
}
