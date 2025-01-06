import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-delete-modal',
  templateUrl: './account-delete-modal.component.html',
  styleUrl: './account-delete-modal.component.scss'
})
export class AccountDeleteModalComponent {

  constructor(private modal: NgbActiveModal){}

  closeModal(){
    this.modal.close();
  }
}
