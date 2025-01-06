import { Component } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cab-information',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './cab-information.component.html',
  styleUrl: './cab-information.component.scss'
})
export class CabInformationComponent {

  constructor(public cabService: CabService) { }

}
