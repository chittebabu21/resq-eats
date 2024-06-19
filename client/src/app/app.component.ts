import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  backgroundColor: string = 'light';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBackgroundColor(event.urlAfterRedirects);
      }
    });
  }

  updateBackgroundColor(url: string) {
    if (url === '/' || url === '/login' || url === '/register') {
      this.backgroundColor = 'warning';
    } else {
      this.backgroundColor = 'light';
    }
  }
}
