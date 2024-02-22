// db.ts
import Dexie, { Table } from 'dexie';
import { BehaviorSubject } from 'rxjs';

export interface Deck {
  id?: number;
  ask: string;
  answer: string;
  score: number;
  lastAccessed: Date;
  attempts: number;
}

export class AppDbService extends Dexie {
  deck!: Table<Deck, number>;
  searchTermSubject = new BehaviorSubject<string>('');

  constructor() {
    super('appDB');
    this.version(3).stores({
      deck: '++id, ask',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    return await db.deck.add({
      ask: "Fash Vocab",
      answer: 'An amazing app to lear a new language!',
      score: 0,
      lastAccessed: new Date(),
      attempts: 0,
    });
  }

}

export const db = new AppDbService();
