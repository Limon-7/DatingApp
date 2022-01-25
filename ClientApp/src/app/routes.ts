import { Routes } from '@angular/router';
import { HomeComponent } from './account/home/home.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { MessageComponent } from './message/message.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MemberDetailedComponent } from './members/member-detailed/member-detailed.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member.edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolver/list.resolver';
export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'members', component: MemberListsComponent
            },
            {
                path: 'members/:userName', component: MemberDetailedComponent
            },
            {
                path: 'member/edit', component: MemberEditComponent,
                // resolve: { user: MemberEditResolver },
                canDeactivate: [PreventUnsavedChanges]
            },
            { path: 'message', component: MessageComponent },
            { path: 'lists', component: ListsComponent, resolve: { users: ListResolver } }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
