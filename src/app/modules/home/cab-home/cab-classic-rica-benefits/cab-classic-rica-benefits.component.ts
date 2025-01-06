import { Component, Input } from '@angular/core';
import { ricaBenefit } from '../../../../shared/interface/cab-classic';
import { TitleComponent } from '../../../../shared/components/comman/title/title.component';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';


@Component({
  selector: 'app-cab-classic-rica-benefits',
  standalone: true,
  imports: [
    TitleComponent,
    AngularSvgIconModule,
    CommonModule
  ],
  templateUrl: './cab-classic-rica-benefits.component.html',
  styleUrls: ['./cab-classic-rica-benefits.component.scss']
})
export class CabClassicRicaBenefitsComponent {

  @Input() benefits: ricaBenefit[];

  public description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias aperiam at, aut commodi corporis dolorum ducimus labore magnam mollitia natus porro possimus quae sit tenetur veniam veritatis voluptate voluptatem!";

}
