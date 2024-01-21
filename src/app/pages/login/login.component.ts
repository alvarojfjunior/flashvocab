import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.toastr.success('Hello world!', 'Toastr fun!');
      }, 2000);
    } else {
    }
  }

  onGoogleSignIn() {
    this.auth
      .signInWithGoogle()
      .then((g) => {
        console.log(g);
        if (g.user) {
          //localStorage.setItem('user', JSON.stringify(g.user));
          this.router.navigate(['/private']);
        }
      })
      .catch((err) => console.log(err));
  }
}
