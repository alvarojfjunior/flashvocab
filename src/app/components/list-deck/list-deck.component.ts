import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../add-card/add-card.component';

@Component({
  selector: 'app-list-deck',
  templateUrl: './list-deck.component.html',
  styleUrls: ['./list-deck.component.css'],
})
export class ListDeckComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openAddDialog() {
    const dialogRef = this.dialog.open(AddCardComponent, {
      height: '400px',
      width: '350px',
    });
  }
}
