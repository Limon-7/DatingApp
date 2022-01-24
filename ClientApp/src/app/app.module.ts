import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { appRoutes } from './routes';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ListsComponent } from './lists/lists.component';
import { MessageComponent } from './message/message.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { RouterModule } from '@angular/router';
import { UserService } from './_services/user.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailedComponent } from './members/member-detailed/member-detailed.component';
import { MemberDetailResolver } from './_resolver/member.detail.resolver';
import { MemberListResolver } from './_resolver/member.list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member.edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { ListResolver } from './_resolver/list.resolver';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AccountModule } from './account/account.module';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';



@NgModule({
   declarations: [
      AppComponent,

      ListsComponent,
      MessageComponent,
      MemberListsComponent,
      MemberCardComponent,
      MemberDetailedComponent,
      MemberEditComponent,
      PhotoEditorComponent,
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
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

      UserService,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChanges,
      ListResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
