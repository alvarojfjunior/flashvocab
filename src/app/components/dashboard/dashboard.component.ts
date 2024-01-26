import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwipeCardsComponent } from '../swipe-cards/swipe-cards.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(public dialog: MatDialog) {}


  openAddDialog() {
    this.dialog.open(SwipeCardsComponent, {
      width: '350px',
    });
  }
}
