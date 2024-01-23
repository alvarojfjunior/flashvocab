import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async sinc() {
    // const dekCollection = this.firestore.collection('dek');
    //const res = await dekCollection.add(this.form.value);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
