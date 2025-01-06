import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiResultFormat } from './model/model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  userRole: any = {
    "user": {},
    "user_2": {},
    "user_3": {},
    "user_4": {},
  }

  actionPermissions: any = {

  }

  constructor(private http: HttpClient) {

  }

}
