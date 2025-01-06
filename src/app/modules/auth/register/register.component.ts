import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommanLoginFormComponent } from '../widgets/comman-login-form/comman-login-form.component';
import { BreadcrumbsComponent } from '../../../shared/components/comman/breadcrumbs/breadcrumbs.component';
import { AnimationComponent } from '../../../shared/components/comman/animation/animation.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AnimationComponent,
    BreadcrumbsComponent,
    CommanLoginFormComponent,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  public bg_image = 'assets/images/cab/bg.jpg';
  public title = 'auth.signup';
  public parent = 'menu.home';
  public child = 'auth.signup';

  constructor() { }

}
