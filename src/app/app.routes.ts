import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdivinaComponent } from './components/adivina/adivina.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'adivina/:nombre', component: AdivinaComponent },
  { path: 'adivina', component: AdivinaComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'login', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
