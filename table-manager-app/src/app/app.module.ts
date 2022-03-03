import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavbarComponent} from './common/navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar} from "@angular/material/snack-bar";
import {JetonComponent} from './jeton/jeton.component';
import {NewPhoneConnectedComponent} from './dialogs/new-phone-connected/new-phone-connected.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    JetonComponent,
    NewPhoneConnectedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSliderModule,
    MatButtonModule,
    DragDropModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatDialogModule
  ],
  providers: [MatSnackBar, {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 1000}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
