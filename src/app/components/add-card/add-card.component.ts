import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-card-deck',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css'],
})
export class AddCardComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      ask: ['', [Validators.required]],
      answer: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.toastr.success('Hello world!', 'Toastr fun!');
      }, 2000);
    } else {
    }
  }
}
