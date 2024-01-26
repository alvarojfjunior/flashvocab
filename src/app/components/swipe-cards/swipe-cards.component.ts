// src/app/swipe-cards/swipe-cards.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-swipe-cards',
  templateUrl: './swipe-cards.component.html',
  styleUrls: ['./swipe-cards.component.css']
})
export class SwipeCardsComponent {
  cards = [
    { name: 'Card 1', description: 'Description 1', imageUrl: 'url_to_your_image1.jpg' },
    { name: 'Card 2', description: 'Description 2', imageUrl: 'url_to_your_image2.jpg' },
    { name: 'Card 3', description: 'Description 3', imageUrl: 'url_to_your_image2.jpg' },
    { name: 'Card 4', description: 'Description 4', imageUrl: 'url_to_your_image2.jpg' },
  ];

  card = { name: 'Card 1', description: 'Description 1', imageUrl: 'url_to_your_image1.jpg' };

  swipeDirection: string | null = null;
  currentIndex: number = 0;

  onPan(event: any): void {
    if (event.isFinal) {
      this.handleCardSwipe();
      return;
    }
    const x = event.deltaX;
    this.swipeDirection = x < 0 ? 'left' : 'right';
  }

  private handleCardSwipe(): void {
    if (this.swipeDirection === 'left') {

    } else if (this.swipeDirection === 'right') {


    }

    this.currentIndex = Math.min(this.currentIndex + 1, this.cards.length - 1);
    this.card = this.cards[this.currentIndex]
    this.swipeDirection = null;
  }
}
