// src/app/swipe-cards/swipe-cards.component.ts
import { Component, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { Deck, db } from '../../services/app-db/app-db.service';

@Component({
  selector: 'app-swipe-cards',
  templateUrl: './swipe-cards.component.html',
  styleUrls: ['./swipe-cards.component.css'],
})
export class SwipeCardsComponent implements OnInit {
  cards$ = liveQuery(() => db.deck.toArray());
  card: Deck;
  swipeDirection: string | null = null;

  constructor() {
    this.card = {
      id: 0,
      answer: '',
      ask: '',
      score: 0,
    };
  }

  ngOnInit(): void {
    this.cards$.subscribe((cards) => {
      const others = cards.filter((c) => c.ask !== this.card.ask);
      const theNextOne = others[Math.floor(Math.random() * others.length)];
      this.card = theNextOne;
      this.swipeDirection = null;
    });
  }

  async onPan(event: any) {
    if (event.isFinal) {
      await this.handleCardSwipe();
      return;
    }
    const x = event.deltaX;
    this.swipeDirection = x < 0 ? 'left' : 'right';
  }

  async handleCardSwipe() {
    if (this.swipeDirection === 'left') {
      await db.deck.update(this.card.id as number, {
        score: this.card.score - 1,
      });
    } else if (this.swipeDirection === 'right') {
      await db.deck.update(this.card.id as number, {
        score: this.card.score + 1,
      });
    }
  }
}
