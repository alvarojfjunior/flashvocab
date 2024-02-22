// src/app/swipe-cards/swipe-cards.component.ts
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
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
  isFlipped = false;
  isDraggingLeft: boolean = false;
  isDraggingRight: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.card = {
      id: 0,
      answer: '',
      ask: '',
      score: 0,
      lastAccessed: new Date(),
      attempts: 0,
    };
  }

  ngOnInit(): void {
    this.nextCard();
  }

  nextCard() {
    this.cards$.subscribe((cards) => {
      const theNextOne = this.getNextCard(cards);
      this.card = theNextOne;
      this.swipeDirection = null;
    });
  }

  getNextCard(cards: Deck[]): Deck {
    const others = cards.filter((c) => c.ask !== this.card.ask);

    // Calcula o total de tentativas dos cards restantes
    const totalAttempts = others.reduce((acc, card) => acc + card.attempts, 0);

    // Calcula a probabilidade de selecionar cada card com base no número de tentativas
    const probabilities = others.map((card) => card.attempts / totalAttempts);

    // Gera um número aleatório entre 0 e 1
    const randomNum = Math.random();

    // Seleciona um card com base nas probabilidades calculadas
    let cumulativeProbability = 0;
    for (let i = 0; i < others.length; i++) {
      cumulativeProbability += probabilities[i];
      if (randomNum <= cumulativeProbability) {
        return others[i];
      }
    }

    // Se ocorrer algum problema, retorna o primeiro card disponível
    return others[0];
  }

  async onSwipe(swipeDirection: 'left' | 'right') {
    this.showAnimation(swipeDirection);

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
      this.card.score = this.card.score - 1;
    } else if (this.swipeDirection === 'right') {
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
