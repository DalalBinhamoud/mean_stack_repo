import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms'
import { ReviewsComponent } from './reviews/reviews.component';
import {HttpClientModule} from '@angular/common/http'
import {ChatService} from './chat.service'
import { NgwWowModule } from 'ngx-wow';
import { EditorComponent } from './editor/editor.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    AppComponent,
    ReviewsComponent,
    EditorComponent,
    ViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgwWowModule,
    HttpClientModule,
    FormsModule,
    
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
