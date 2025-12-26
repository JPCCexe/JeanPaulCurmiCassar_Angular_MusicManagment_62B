import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { RecordsList } from './components/records-list/records-list';
import { RecordDetails } from './components/record-details/record-details';
import { AddRecord } from './components/add-record/add-record';
import { UpdateRecord } from './components/update-record/update-record';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'records', component: RecordsList },
    { path: 'records/add', component: AddRecord },
    { path: 'records/:id', component: RecordDetails },
    { path: 'records/:id/edit', component: UpdateRecord },
    { path: '**', redirectTo: '/login' }
];
