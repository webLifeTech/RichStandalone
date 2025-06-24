import { Component } from '@angular/core';
import { LayoutComponent } from '../../components/ui/layout/layout.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-1',
  standalone: true,
  imports: [
    RouterOutlet,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './layout-1.component.html',
  styleUrl: './layout-1.component.scss'
})
export class Layout1Component {

}
