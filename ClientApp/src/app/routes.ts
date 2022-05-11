import { Routes } from '@angular/router';
import { HomeComponent } from './account/home/home.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MemberDetailedComponent } from './members/member-detailed/member-detailed.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChanges } from './core/guards/prevent-unsaved-changes.guard';
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
                canDeactivate: [PreventUnsavedChanges]
            },
            { path: 'message', loadChildren: () => import("./message/message.module").then(m => m.MessageModule) },
            { path: 'lists', component: ListsComponent }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
