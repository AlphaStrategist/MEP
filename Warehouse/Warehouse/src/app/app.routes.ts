import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddProductComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './auth.guard';
import { ProductsListComponent } from './products-list/products-list.component';
import { AdminChartComponent } from './admin-chart/admin-chart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: AddProductComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'products-list', component: ProductsListComponent },
  { path: 'admin-chart', component: AdminChartComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
