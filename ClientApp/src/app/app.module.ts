import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { appRoutes } from './routes';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ListsComponent } from './lists/lists.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { RouterModule } from '@angular/router';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailedComponent } from './members/member-detailed/member-detailed.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AccountModule } from './account/account.module';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { MemberMessageComponent } from './members/member-message/member-message.component';



@NgModule({
   declarations: [
      AppComponent,

      ListsComponent,
      MemberListsComponent,
      MemberCardComponent,
      MemberDetailedComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      MemberMessageComponent,
   ],
   imports: [
      BrowserModule,
      CommonModule,
      HttpClientModule,
      CoreModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,

      RouterModule.forRoot(appRoutes),
      AccountModule
   ],
   exports: [
   ],
   providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
