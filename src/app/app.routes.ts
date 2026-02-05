import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { PlantesTable } from './plantes/plantes-table/plantes-table';
import { PlantesList } from './plantes/plantes-list/plantes-list';
import { PlantesDetall } from './plantes/plantes-detall/plantes-detall';
import { Login } from './components/login/login';
import { Registre } from './components/registre/registre';
import { Mapa } from './components/mapa/mapa';

export const routes: Routes = [
    { path: 'home', component: Home},
    { path: 'plantes', component: PlantesList },
    { path: 'plantes_table', component: PlantesTable},
    { path: 'planta/:id', component: PlantesDetall },
    { path: 'login', component: Login },
    { path: 'registre', component: Registre },
    { path: 'mapa', component: Mapa },
    { path: '**',pathMatch: 'full', redirectTo: 'home'},//si en tot el path es qualsevol cosa q no siga una de les definides que duga a home
];
