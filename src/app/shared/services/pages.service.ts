import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pages } from '../interface/pages';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(private http: HttpClient) {}

  // Pages
  pages(): Observable<pages>{
    return this.http.get<pages>('assets/json/pages/pages.json');
  }
}
