import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwipeCardsComponent } from '../swipe-cards/swipe-cards.component';
import { liveQuery } from 'dexie';
import { db } from '../../services/app-db/app-db.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  cards$ = liveQuery(() => db.deck.toArray());
  toLearn = 0;
  learned = 0;

  constructor(public dialog: MatDialog) {
    this.cards$.subscribe((cards) => {
      this.toLearn = cards.filter((c) => c.score < 10).length;
      this.learned = cards.filter((c) => c.score >= 10).length;
    });
  }

  openAddDialog() {
    this.dialog.open(SwipeCardsComponent, {
      panelClass: 'card-panel',
      width:'300px',
      height: '400px'
    });
  }
}
