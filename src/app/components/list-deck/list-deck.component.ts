import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../card-form/card-form.component';
import { liveQuery } from 'dexie';
import { Deck, db } from '../../services/app-db/app-db.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-list-deck',
  templateUrl: './list-deck.component.html',
  styleUrls: ['./list-deck.component.css'],
})
export class ListDeckComponent implements OnInit {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  cards$: Observable<Deck[]> | undefined;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.cards$ = combineLatest([this.searchTerm$]).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(([searchTerm]) => this.getFilteredCards(searchTerm))
    );
  }

  filter(event: any) {
    this.searchTermSubject.next(event.target.value);
  }

  private getFilteredCards(searchTerm: string): Promise<Deck[]> {
    return db.deck.where('ask').startsWithIgnoreCase(searchTerm).toArray();
  }

  identifyList(index: number, list: Deck) {
    return `${list.id}${list.ask}`;
  }

  handleEdit(data: any) {
    this.dialog.open(AddCardComponent, {
      data,
      width: '300px',
    });
  }

  handleDelete(data: any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) db.deck.delete(data.id);
    });
  }

  openAddDialog() {
    this.dialog.open(AddCardComponent, {
      width: '350px',
    });
  }
}
