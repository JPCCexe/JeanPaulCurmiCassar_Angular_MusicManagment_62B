import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { RecordsList } from './components/records-list/records-list';
import { RecordDetails } from './components/record-details/record-details';
import { AddRecord } from './components/add-record/add-record';
import { UpdateRecord } from './components/update-record/update-record';
import { authorisationGuard } from './guard/authorisation-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: 'records',
        component: RecordsList,
        canActivate: [authorisationGuard],
        data: { roles: ['clerk', 'manager', 'admin'] }
    },
    {
        path: 'records/add',
        component: AddRecord,
        canActivate: [authorisationGuard],
        data: { roles: ['manager', 'admin'] }
    },
    {
        path: 'records/:id',
        component: RecordDetails,
        canActivate: [authorisationGuard],
        data: { roles: ['clerk', 'manager', 'admin'] }
    },
    {
        path: 'records/:id/edit',
        component: UpdateRecord,
        canActivate: [authorisationGuard],
        data: { roles: ['manager', 'admin'] }
    },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
