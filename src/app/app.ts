import { Component, signal, effect } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  title = signal('college-frontend');

  currentRoute = signal('');

  constructor(private router: Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.set(event.url);
      }
    });
  }

  // 🔥 CHECK IF HEADER SHOULD SHOW
  showLayout() {
    const route = this.currentRoute();

    return !(
      route.includes('/login') ||
      route.includes('/student') ||
      route.includes('/staff')
    );
  }
}