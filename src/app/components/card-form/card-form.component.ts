import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { db } from '../../services/app-db/app-db.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css'],
})
export class AddCardComponent {
  form: FormGroup;
  isLoading: boolean = false;
  isEdditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdditing = data ? true : false;
    this.form = this.fb.group({
      ask: ['', [Validators.required]],
      answer: ['', [Validators.required]],
    });

    if (this.isEdditing)
      this.form.setValue({
        ask: data.ask,
        answer: data.answer,
      });
  }

  async onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;

      if (this.isEdditing) {
        await db.deck.update(this.data.id, this.form.value);
        this.dialogRef.close();
      } else {
        await db.deck.add({ ...this.form.value, score: 0 });
        this.form.reset();
      }

      this.isLoading = false;
      this.toastr.success('Success!', 'Card added!');
    } else {
      this.toastr.error('Error!', 'Something wrong happened!');
    }

    db.searchTermSubject.next('');
  }
}
