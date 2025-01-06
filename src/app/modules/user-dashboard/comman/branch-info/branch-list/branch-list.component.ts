import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../../shared/services/alert.service';
import { PaginationService } from '../../../../../shared/services/pagination.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BranchAddEditComponent } from '../branch-add-edit/branch-add-edit.component';
import { BranchInfoModalComponent } from '../../modal/branch-info-modal/branch-info-modal.component';
import { DeleteModalComponent } from '../../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [
    BranchAddEditComponent,
    CommonModule,
    FormsModule,
    MatTabsModule,
    TranslateModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
})

export class BranchbranchListComponent {
  currentPage: number = 1; //
  pageSize: number = 1;
  totalRecord: any = 0;
  searchText: any;
  editIndex: any = 0;

  @Input() formType: any;
  editInfo: any = {}
  isAdd: boolean = false;

  menuForm: any = {
    menu_name: "",
    status: null,
    sub_menu_name: "",
    parent_menu: null,
    redirect_url: "",
    description: "",
  };

  statusList: any = [
    { name: 'Active', value: true },
    { name: 'Deactive', value: false },
  ];

  userList: any = [
    {
      "id": 1,
      "branch_dba_name": "XYZ",
      "branch_first_name": "abc",
      "branch_last_name": "z",
      "branch_contact_number": "9458374658",
      "branch_email_id": "abc@gmail.com",
      "branch_city": "Surat",
      "branch_postal_code": "390411",
      "branch_address": "1, surat",
      "branch_address2": "2, surat",
      "branch_map_location": "no"
    }
  ];

  constructor(
    private toast: ToastService,
    private alert: AlertService,
    private paginationService: PaginationService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
  }

  getUsers() {
  }

  onView(item: any) {
    const modalRef = this.modalService.open(BranchInfoModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  onEdit(item: any, index: any) {
    this.editInfo = item;
    this.editIndex = index;
    this.isAdd = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.userList.splice(index, 1);
        this.toast.successToastr("Deleted successfully");
      }
    }, () => {
    });
  }

  cancelAdd() {
    this.isAdd = false;
  }

  onSubmit(form: any) {
    this.userList.unshift(form);
    this.toast.successToastr("User added successfully");
    this.editInfo = {};
    this.isAdd = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onUpdate(form: any) {
    this.userList[this.editIndex] = form;
    this.toast.successToastr("User updated successfully");
    this.editInfo = {};
    this.isAdd = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }
}
