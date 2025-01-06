import { Component } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profile-edit-modal',
  standalone: true,
  imports: [
    NgbModule
    // CommonModule,
    // NgbDatepicker
  ],
  templateUrl: './user-profile-edit-modal.component.html',
  styleUrl: './user-profile-edit-modal.component.scss'
})
export class UserProfileEditModalComponent {

  constructor(private modal: NgbActiveModal) { }

  closeModal() {
    this.modal.close();
  }
}
