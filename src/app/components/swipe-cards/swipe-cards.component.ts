// src/app/swipe-cards/swipe-cards.component.ts
import { Component, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { Deck, db } from '../../services/app-db/app-db.service';
import { HttpClient } from '@angular/common/http';

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
  isPlaying = false;
  audioSrc = '';
  apiKey = 'effa1Noe';

  constructor(private http: HttpClient) {
    this.card = {
      id: 0,
      answer: '',
      ask: '',
      score: 0,
    };
  }

  fetchAudio() {
    this.http
      .post('https://api.responsivevoice.org/v1/text/', {
        text: 'Convert text to speech with natural-sounding using an API powered by AI technologies',
        voiceService: 'servicebin',
        voiceID: 'en-US',
        voiceSpeed: '0',
      })
      .subscribe((data: any) => {
        console.log(data);
        this.audioSrc = URL.createObjectURL(data);
      });
  }

  ngOnInit(): void {
    this.cards$.subscribe((cards) => {
      const others = cards.filter((c) => c.ask !== this.card.ask);
      const theNextOne = others[Math.floor(Math.random() * others.length)];
      this.card = theNextOne;
      this.swipeDirection = null;

      //this.fetchAudio();
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

    this.isFlipped = false;
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;

  }

  toggleAudio() {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;

    if (audioElement) {
      if (this.isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }

      this.isPlaying = !this.isPlaying;
    }
  }
}
