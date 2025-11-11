import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RolePermissionService, ButtonConfig } from '../../../../shared/services/rolepermission.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-table-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  templateUrl: './table-search-bar.component.html',
  styleUrl: './table-search-bar.component.scss'
})
export class TableSearchBarComponent {


  @Input({ required: true }) transactionCode: string = '';
  @Output() actionClicked = new EventEmitter<any>();

  dateTimeRange: any = "";
  globalSearch: any = "";

  constructor(
    public gs: GlobalService,
    public roPrmission: RolePermissionService,
  ) {
    // this.roPrmission.getButtons("MYCR");
  }
  buttons = signal<ButtonConfig[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactionCode'] && this.transactionCode) {
      this.loadButtons();
    }
  }

  loadButtons(): void {
    const body = {
      TransactionCode: this.transactionCode,
      UserType: this.gs.loggedInUserInfo?.['roleName']
    };
    this.roPrmission.getActionButtons(body).subscribe(buttons => {
      this.buttons.set(buttons);
    });
  }

  onActionClick(code: string): void {
    this.actionClicked.emit({
      actionCode: code,
      date: this.dateTimeRange,
      search: this.globalSearch
    });
  }
}
