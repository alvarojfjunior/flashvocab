// src/app/swipe-cards/swipe-cards.component.ts
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
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
  isDraggingLeft: boolean = false;
  isDraggingRight: boolean = false;

  private speech: any;

  constructor(private renderer: Renderer2, private el: ElementRef) {
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

  async onSwipe(swipeDirection: 'left' | 'right') {
    this.showAnimation(swipeDirection)

    if (swipeDirection === 'left') {
      this.isDraggingLeft = true;
      setTimeout(() => {
        this.isDraggingLeft = false;
      }, 1000);
    } else if (swipeDirection === 'right') {
      this.isDraggingRight = true;
      setTimeout(() => {
        this.isDraggingRight = false;
      }, 1000);
    }

    this.swipeDirection = swipeDirection;

    this.handleCardSwipe();
  }

  async handleCardSwipe() {
    this.card.attempts += 1;
    this.card.lastAccessed = new Date();
    if (this.swipeDirection === 'left') {
      console.log('left')
      this.card.score = this.card.score - 1;
    } else if (this.swipeDirection === 'right') {
      console.log('right')
      this.card.score = this.card.score + 1;
    }
    await db.deck.update(this.card.id as number, this.card);
    this.isFlipped = false;
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }


  showAnimation(side: any) {
    const feedbackDiv = this.renderer.createElement('div');
    this.renderer.addClass(feedbackDiv, 'feedback');
    const text = this.renderer.createText(side === 'right' ? '😎' : '💔');
    this.renderer.appendChild(feedbackDiv, text);
    this.renderer.appendChild(this.el.nativeElement, feedbackDiv);

    setTimeout(() => {
      this.renderer.removeChild(this.el.nativeElement, feedbackDiv);
    }, 1000);
  }
}
