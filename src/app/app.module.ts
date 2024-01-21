import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './pages/login/login.component';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ListDeckComponent } from './components/list-deck/list-deck.component';
import { MainComponent } from './pages/private/main/main.component';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddCardComponent } from './components/add-card/add-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    ListDeckComponent,
    MainComponent,
    DashboardComponent,
    AddCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatSlideToggleModule,
    MatInputModule,
    MatDialogModule,
    MatButton,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
  ],
  exports: [SpinnerComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
