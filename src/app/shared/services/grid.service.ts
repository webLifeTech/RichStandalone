import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  public listView: boolean = false;
  public col_sm_6: boolean = true;
  public col_xl_4: boolean = false;
  public col_xl_3: boolean = false;
  public col_lg_4: boolean = false;
  public col_12: boolean = false;

  grid2(){
    this.listView = false;
    this.col_sm_6 = true;
    this.col_xl_4 = false;
    this.col_xl_3 = false;
    this.col_lg_4 = false;
    this.col_12 = false;
  }

  grid3(){
    this.listView = false;
    this.col_sm_6 = true;
    this.col_xl_4 = true;
    this.col_xl_3 = false;
    this.col_lg_4 = false;
    this.col_12 = false;
  }

  grid4(){
    this.listView = false;
    this.col_sm_6 = true;
    this.col_xl_3 = true;
    this.col_lg_4 = true;
    this.col_xl_4 = false;
    this.col_12 = false;
  }

}
