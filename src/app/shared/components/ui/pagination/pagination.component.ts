import { Component, EventEmitter, Input, Output } from '@angular/core';
import { cab, pagination } from '../../../../shared/interface/cab';
import { d_pagination, driver } from '../../../../shared/interface/driver';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() cabDetails: cab[] = [];
  @Input() paginate: pagination;
  @Input() driverDetails: driver[] = [];
  @Input() d_paginate: d_pagination;
  @Input() total: number;
  @Input() currentPage: number;
  @Input() pageSize: number;

  @Output() setPage: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  pageSet(page: number) {
    this.setPage.emit(page); // Set Page Number
  }
}
