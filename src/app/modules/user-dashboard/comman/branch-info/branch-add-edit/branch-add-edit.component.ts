import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { RoleService } from '../../../../../shared/services/role.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-branch-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule
  ],
  templateUrl: './branch-add-edit.component.html',
  styleUrl: './branch-add-edit.component.scss'
})

export class BranchAddEditComponent {
  @Input() editInfo: any;
  @Input() isEditInfo: boolean = false;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onUpdateSubmit = new EventEmitter<any>();

  branchInfoForm: any = {
    branch_dba_name: "",
    branch_first_name: "",
    branch_last_name: "",
    branch_contact_number: "",
    branch_email_id: "",
    branch_city: "",
    branch_postal_code: "",
    branch_address: "",
    branch_address2: null,
    branch_map_location: null,
  };

  roleList: any = [];
  statusList: any = [
    { name: 'Active', value: true },
    { name: 'Deactive', value: false },
  ];
  constructor(
    private modal: NgbModal,
    private toast: ToastService,
  ) {
    this.getRoleList();
  }

  getRoleList() {
  }

  ngOnInit() {
    if (this.editInfo.id) {
      this.isEditInfo = true;
      this.branchInfoForm.id = this.editInfo.id;
      this.branchInfoForm.branch_dba_name = this.editInfo.branch_dba_name;
      this.branchInfoForm.branch_first_name = this.editInfo.branch_first_name;
      this.branchInfoForm.branch_last_name = this.editInfo.branch_last_name;
      this.branchInfoForm.branch_contact_number = this.editInfo.branch_contact_number;
      this.branchInfoForm.branch_email_id = this.editInfo.branch_email_id;
      this.branchInfoForm.branch_city = this.editInfo.branch_city;
      this.branchInfoForm.branch_postal_code = this.editInfo.branch_postal_code;
      this.branchInfoForm.branch_address = this.editInfo.branch_address;
      this.branchInfoForm.branch_address2 = this.editInfo.branch_address2;
      this.branchInfoForm.branch_map_location = this.editInfo.branch_map_location;
    }
  }

  onFromSubmit(form: any) {
    this.branchInfoForm.id = 100;
    this.onSubmit.emit(this.branchInfoForm);
  }

  onFromUpdate() {
    this.onUpdateSubmit.emit(this.branchInfoForm);
  }

  cancel() {
    this.onCancel.emit(null)
  }
}
