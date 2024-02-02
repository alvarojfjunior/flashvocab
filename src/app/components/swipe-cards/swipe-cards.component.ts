// src/app/swipe-cards/swipe-cards.component.ts
import { Component, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { Deck, db } from '../../services/app-db/app-db.service';
import Speech from 'speak-tts';

@Component({
  selector: 'app-swipe-cards',
  templateUrl: './swipe-cards.component.html',
  styleUrls: ['./swipe-cards.component.css'],
})
export class SwipeCardsComponent implements OnInit {
  cards$ = liveQuery(() => db.deck.toArray());
  card: Deck;
  swipeDirection: string | null = null;
  isFlipped = false;
  private speech: any;

  constructor() {
    this.card = {
      id: 0,
      answer: '',
      ask: '',
      score: 0,
      lastAccessed: new Date(),
      attempts: 0,
    };

    this.speech = new Speech();
    if (this.speech.hasBrowserSupport()) {
      this.speech.init();
    }
  }

  play() {
    this.speech.speak({
      text: this.card.ask,
      queue: false,
    });
  }

  ngOnInit(): void {
    this.nextCard();
  }

  nextCard() {
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
    console.log('Swiped')
    this.card.attempts += 1;
    this.card.lastAccessed = new Date();
    if (this.swipeDirection === 'left') {
      this.card.score = this.card.score - 1;
    } else if (this.swipeDirection === 'right') {
      this.card.score = this.card.score + 1;
    }
    await db.deck.update(this.card.id as number, this.card);
    this.isFlipped = false;
  }

  toggleFlip() {
    console.log('Fliped')
    this.isFlipped = !this.isFlipped;
  }
}
