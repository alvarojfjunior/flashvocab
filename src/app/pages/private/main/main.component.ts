import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }

}
