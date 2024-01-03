import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
  ) { }

  ngOnInit() {
    console.log("It's the onInit from LoginComponent")
  }

  loginWithGoogle() {
    console.log('ok')
  }

}
