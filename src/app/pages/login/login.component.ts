import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  onGoogleSignIn() {
    this.auth
      .signInWithGoogle()
      .then((g) => {
        if (g.user) {
          this.router.navigate(['/private']);
        }
      })
      .catch((err) => console.log(err));
  }
}
