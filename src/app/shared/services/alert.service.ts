import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  informationAlert(title: string, description: string, icon: 'info' | 'warning' | 'error' | 'success', button: string) {
    Swal.fire({
      title: title,
      text: description,
      icon: icon,
      confirmButtonText: button
    });
  }

  confirmationAlert(title: string, description: string, icon: 'info' | 'warning' | 'error' | 'success', button: string) {
    return Swal.fire({
      title: title,
      text: description,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: button
    }).then((result) => {
      return result.isConfirmed
    });
  }
}
