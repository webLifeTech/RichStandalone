import { Component } from '@angular/core';
import { footerUsefulLink } from '../../../data/data/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-useful-links',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './useful-links.component.html',
  styleUrls: ['./useful-links.component.scss']
})
export class UsefulLinksComponent {

  public footerUsefulLink = footerUsefulLink;

}
