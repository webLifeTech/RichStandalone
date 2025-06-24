import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deactive-account-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './deactive-account-modal.component.html',
  styleUrl: './deactive-account-modal.component.scss'
})
export class DeactiveAccountModalComponent {
  @Input() title: string;

  public password: boolean[] = [false];

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  public togglePassword(index: any) {
    this.password[index] = !this.password[index]
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    this.activeModal.close({ confirmed: true });
  }
}
