import { Routes } from '@angular/router';
import { Labs } from "../app/labs/labs";
import { Home } from "../app/home/home";

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'labs',
        component: Labs
    }
];
