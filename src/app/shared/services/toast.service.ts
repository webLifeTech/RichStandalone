import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastr: ToastrService,
  ) { }

  // Success Toastr
  successToastr(msg: any) {
    this.toastr.success(msg, 'Success', {
      timeOut: 2000,
    });
  }

  // Error Toastr
  errorToastr(msg: any) {
    this.toastr.error(msg, 'Oops', {
      timeOut: 2000,
    });
  }

  // Warning Toastr
  warningToastr(msg: any) {
    this.toastr.warning(msg, 'Warning', {
      timeOut: 2000,
    });
  }

}
