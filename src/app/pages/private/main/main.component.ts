import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { db } from '../../../services/app-db/app-db.service';
import { catchError, of, switchMap, take, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  isLoading: boolean = false;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  arraysEqual(arr1: any, arr2: any) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  removeDuplicates(arr: any[]): any[] {
    const uniqueObjects = new Map();

    for (const obj of arr) {
      const propValue = obj.ask;

      if (!uniqueObjects.has(propValue)) {
        uniqueObjects.set(propValue, obj);
      }
    }

    return Array.from(uniqueObjects.values());
  }

  async sinc() {
    const lastSyncTime = localStorage.getItem('lastSyncTime');
    const now = new Date().getTime();

    if (!lastSyncTime || now - parseInt(lastSyncTime, 10) >= 60000) {
      this.isLoading = true;
      let currentUserData: any;

      this.auth.user$
        .pipe(
          tap((userData) => {
            currentUserData = userData;
          }),
          switchMap((userData) => {
            return this.firestore
              .collection('decks')
              .doc(userData.uid)
              .valueChanges();
          }),
          catchError((error) => {
            console.error('Erro ao obter dados do Firestore:', error);
            this.isLoading = false;
            return of(null);
          }),
          take(1) // Completa a assinatura após a primeira emissão
        )
        .subscribe(async (cloudDeck: any) => {
          const localDeck = await db.deck.toArray();
          const mergedArray = this.removeDuplicates([
            ...new Set([...localDeck, ...(cloudDeck?.deck || [])]),
          ]);

          if (!this.arraysEqual(localDeck, cloudDeck?.deck)) {
            const deckDocRef = this.firestore
              .collection('decks')
              .doc(currentUserData.uid);

            for (const card of mergedArray) {
              const existingItem = await db.deck.get(card.id);
              if (existingItem) await db.deck.update(card.id, card);
              else await db.deck.add(card);
            }

            if (cloudDeck) {
              deckDocRef.update({ deck: mergedArray });
            } else {
              deckDocRef.set({ deck: mergedArray });
            }

            db.searchTermSubject.next('');

            const now = new Date().getTime();
            localStorage.setItem('lastSyncTime', now.toString());
            this.isLoading = false;
            this.toastr.success("All sync!");
          }
        });
    } else {
      //Fez sync a menos de um minuto.
      this.toastr.warning("You can't do sync in a row. Wait 1 minute.");
    }
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
