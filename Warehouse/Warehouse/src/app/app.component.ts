import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'Warehouse';
  [x: string]: any;
  userRole: string = 'guest';
  currentDateTime: string = '';

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getUserName(): string {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return '';
    const user = JSON.parse(storedUser);
    return user.name;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
