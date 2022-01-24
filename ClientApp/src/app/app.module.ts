import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { appRoutes } from './routes';
import { JwtModule } from '@auth0/angular-jwt';


import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';


import { AuthService } from './_services/auth.service';


import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/alertify.service';
import { ListsComponent } from './lists/lists.component';
import { MessageComponent } from './message/message.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
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



export function tokenGetter() {
   return localStorage.getItem('token');
}
@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
   overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
   };
}
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
      JwtModule.forRoot({
         config: {
            // tslint:disable-next-line: object-literal-shorthand
            tokenGetter: tokenGetter,
            // whitelistedDomains: ['localhost:5000'],
            // blacklistedRoutes: ['localhost:3000']
         }
      }),
      AccountModule
   ],
   exports: [
   ],
   providers: [
      {
         provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig
      },
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
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
