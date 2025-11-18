import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from '../../../../../app.routes';
import { ToastService } from '../../../../../shared/services/toast.service';
import { GlobalService } from '../../../../../shared/services/global.service';
import { SettingsService } from '../../../../../shared/services/setting.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss'
})
export class ChangePasswordModalComponent {

  @Input() title: string;
  @Input() singleDetails: any = {};
  @Input() isAdd: boolean;
  @Input() isEdit: boolean;
  reason: any = "";

  public routes = routes;
  public password: boolean[] = [false];

  public togglePassword(index: any) {
    this.password[index] = !this.password[index]
  }
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private gs: GlobalService,
    private toast: ToastService,
    public bf: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.form = this.bf.group({
      UserName: this.gs.loggedInUserInfo.username,
      UserId: this.gs.loggedInUserInfo.userId,
      OldPassword: ["", [Validators.required, Validators.pattern(this.gs.passPattern)]],
      NewPassword: ["", [Validators.required, Validators.pattern(this.gs.passPattern)]],
      ConfirmNewPassword: ["", [Validators.required, Validators.pattern(this.gs.passPattern)]],
    })
  }

  ngOnInit() {
  }

  get fc(): any {
    return this.form.controls;
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onConfirm() {
    this.activeModal.close({ confirmed: true, reason: this.reason });
  }

  submitForm() {

    console.log("fc.OldPassword?.errors >>>>>>", this.fc.OldPassword?.errors);

    this.submitted = true;
    if (!this.form.valid) {
      this.toast.errorToastr("Please enter valid details.");
      return;
    }

    if (this.form.value.NewPassword !== this.form.value.ConfirmNewPassword) {
      this.toast.errorToastr('New password and confirm password do not match.');
      return;
    }

    this.gs.isSpinnerShow = true;
    this.settingsService.ChangePassword(this.form.value).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      console.log("ChangePassword >>>", res);
      if (res && res.statusCode == "200") {
        this.toast.successToastr(res.message);
        this.onConfirm();
      } else {
        this.toast.errorToastr(res.message);
      }
    })
  }

}
