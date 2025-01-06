import { Component } from '@angular/core';
import { AnimationComponent } from '../../../shared/components/comman/animation/animation.component';
import { BreadcrumbsComponent } from '../../../shared/components/comman/breadcrumbs/breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommanLoginFormComponent } from '../widgets/comman-login-form/comman-login-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    AnimationComponent,
    BreadcrumbsComponent,
    CommanLoginFormComponent,
    TranslateModule
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  public bg_image = 'assets/images/cab/bg.jpg';
  public title = 'auth.login';
  public parent = 'menu.home';
  public child = 'auth.login';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    window.scrollTo({ top: 10, behavior: 'smooth' });
    // this.route.queryParams.subscribe((params) => {
    //   // this.router.navigate(['/auth/log-in'], {
    //   //   queryParams: params,
    //   // });
    // })
  }

}
