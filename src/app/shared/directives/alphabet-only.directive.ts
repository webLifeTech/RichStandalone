import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAlphabetOnly]',
  standalone: true
})

export class AlphabetOnlyDirective {
  private allowedControlKeys = [
    'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Shift', 'Control', 'Meta'
  ];

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const key = event.key;

    const isLetter = /^[a-zA-Z]$/.test(key);
    const isSpace = key === ' ';
    const isControlKey = this.allowedControlKeys.includes(key);

    if (!isLetter && !isSpace && !isControlKey) {
      event.preventDefault();
    }
  }
  // key: any;
  // @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
  //   this.key = event.keyCode;
  //   if ((this.key >= 15 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 105) || (this.key == 107) || (this.key == 109) || (this.key == 110) || (this.key == 111) || (this.key == 106)) {
  //     event.preventDefault();
  //   }
  // }
}
