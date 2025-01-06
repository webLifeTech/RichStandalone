import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enquire-modal',
  templateUrl: './enquire-modal.component.html',
  styleUrl: './enquire-modal.component.scss'
})
export class EnquireModalComponent {

  constructor(private modal: NgbActiveModal){}

  closeModal(){
    this.modal.close();
  }
}
