import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrl: './card-modal.component.scss'
})
export class CardModalComponent {

  @Input() modalType: string;

  constructor(private modal: NgbActiveModal){}

  closeModal(){
    this.modal.close();
  }

}
