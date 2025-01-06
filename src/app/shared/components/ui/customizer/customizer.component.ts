import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss']
})
export class CustomizerComponent {

  public themeColor: boolean = false;
  public themeDirection: boolean = false;

  constructor() {
    let layout_version = localStorage.getItem('layout_version');
    let layout_type = localStorage.getItem("layout_type");
    if (layout_version == 'dark-layout') {
      this.themeColor = true;
      document.body.classList.add('dark');
      localStorage.setItem('layout_version', 'dark-layout')
    } else {
      this.themeColor = false;
      document.body.classList.remove('dark');
      localStorage.setItem('layout_version', '')
    }

    if (layout_type == 'rtl') {
      this.themeDirection = true;
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
      localStorage.setItem('layout_type', 'rtl')
    } else {
      this.themeDirection = false;
      document.getElementsByTagName('html')[0].removeAttribute('dir');
      document.body.classList.remove('rtl');
      localStorage.setItem('layout_type', '')
    }
  }


  changeThemeColor(color: boolean) {
    if (color == true) {
      document.body.classList.add('dark');
      localStorage.setItem('layout_version', 'dark-layout')
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('layout_version', '')
    }
  }

  changedDirection(direction: boolean) {
    if (direction == true) {
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
      localStorage.setItem('layout_type', 'rtl')
    } else {
      document.getElementsByTagName('html')[0].removeAttribute('dir');
      document.body.classList.remove('rtl');
      localStorage.setItem('layout_type', '')
    }
  }
}
