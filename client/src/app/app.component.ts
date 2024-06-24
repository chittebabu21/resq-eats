import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  backgroundColor: string = 'light';
  isLoggedIn = false;
  // showTabs = true;

  constructor(private router: Router, private userService: UserService) {
    
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: (event: any) => {
        const navigationEndEvent = event as NavigationEnd;
        console.log(navigationEndEvent);
        if (navigationEndEvent.url === '/' || navigationEndEvent.url === '/login' || navigationEndEvent.url === '/register') {
          this.isLoggedIn = false;
        } else {
          this.isLoggedIn = true;
        }
        // this.showTabs = !['/', '/login'].includes(navigationEndEvent.urlAfterRedirects);
      }
    });
  }
}
