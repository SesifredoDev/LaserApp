import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { MapPage } from './map/map.page';
import { TabControlComponent } from './tab-control/tab-control.component';
import { gameGaurd } from '../shared/authGaurd/game.gaurd';

const routes: Routes = [
  {
    path: '',
    component: TabControlComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePage },
      { path:'map', component: MapPage, canActivate:[gameGaurd] },
      { path: 'leaderboard', loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardPageModule), canActivate: [gameGaurd] },
    ]
    },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
