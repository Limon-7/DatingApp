import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { MessageComponent } from './message/message.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberDetailedComponent } from './members/member-detailed/member-detailed.component';
import { MemberDetailResolver } from './resolver/member.detail.resolver';
import { MemberListResolver } from './resolver/member.list.resolver';
export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListsComponent,
                resolve:{users: MemberListResolver}},
            { path: 'members/:id', component: MemberDetailedComponent,
                resolve: {user: MemberDetailResolver}},
            { path: 'message', component: MessageComponent },
            { path: 'lists', component: ListsComponent }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
