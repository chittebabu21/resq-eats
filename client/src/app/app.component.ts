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
  showTabs = false;

  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: (event: any) => {
        const navigationEndEvent = event as NavigationEnd;
        
        this.updateTabsVisibility(navigationEndEvent.urlAfterRedirects);
      }
    });
    
    this.updateTabsVisibility(this.router.url);
  }

  private updateTabsVisibility(url: string) {
    if (url === '/' || url === '/login' || url === '/register') {
      this.showTabs = false;
    } else {
      this.showTabs = true;
    }
  }
}
