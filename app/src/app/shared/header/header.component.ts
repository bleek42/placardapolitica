import { Component, OnInit } from '@angular/core';
import {
  Router, NavigationStart, RoutesRecognized, RouteConfigLoadStart,
  RouteConfigLoadEnd, NavigationEnd, NavigationCancel, NavigationError
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppStateService } from 'src/app/app-state.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  landing = true;
  constructor(
    public translate: TranslateService,
    public appStore: AppStateService,
    private router: Router) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((d: any) => {
        if (d.url === '/') {
          this.landing = true;
        } else {
          this.landing = false;
        }
      });
  }

  logout() {
    this.appStore.user = null;
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
