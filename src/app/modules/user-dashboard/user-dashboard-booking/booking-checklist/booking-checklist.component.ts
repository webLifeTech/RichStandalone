import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';
import { BookingService } from '../../../../shared/services/booking.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { OnlynumberDirective } from '../../../../shared/directives/number-only.directive';

@Component({
  selector: 'app-booking-checklist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    OnlynumberDirective,
  ],
  providers: [DatePipe],
  templateUrl: './booking-checklist.component.html',
  styleUrl: './booking-checklist.component.scss'
})
export class BookingChecklistComponent {

  @Input() bookingRefNo: any = "";
  @Input() bookingDetails: any = {};
  @Output() onCancel = new EventEmitter<any>();
  //
  type: string;

  inspectionForm: FormGroup;
  submitted: boolean = false;

  // vehicle-checklist.data.ts
  checklist: any = [
    // { "satisfactory": false, "defective": false, "na": false, description: 'Condition & function of seatbelts' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Head restraint adjustment' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Mirror adjustment' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'First AID kit' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Fire extinguisher' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Torch' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Warning triangle' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Vehicle handbook' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'All lights' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Horn' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Washers and wipers' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Brake' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Fuel' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Engine oil level' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Coolant level' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Wind screen wash level' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Brake/clutch fluid' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Condition of battery' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Oil or waste leaks' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Condition of windscreen' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Cleanness of windscreen windows' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Security of load, trailer, roofrack' },
    // { "satisfactory": false, "defective": false, "na": false, description: 'Condition of tyres' },
  ];

  constructor(
    public bf: FormBuilder,
    private toast: ToastService,
    public gs: GlobalService,
    private bookingService: BookingService,
    private datePipe: DatePipe,
  ) {
    this.inspectionForm = this.bf.group({
      "inspectorName": [null, Validators.required],
      "licensePlateNumber": ["", Validators.required],
      "vinNumber": ["", Validators.required],
      "odometerReading": ["", Validators.required],
    })
  }

  ngOnInit() {
    if (this.gs.loggedInUserInfo.role === 'user') {
      this.GetMasterInspectionLineItems();
    } else {
      this.GetPostMasterInspectionLineItems();
    }
  }

  GetMasterInspectionLineItems() {
    const body = {
      "inspectiontype": this.gs.loggedInUserInfo.role === 'user' ? "PRE_RENTAL" : "POST_RENTAL",
    }
    this.gs.isSpinnerShow = true;
    this.bookingService.GetMasterInspectionLineItems(body).subscribe((res: any) => {
      console.log("GetMasterInspectionLineItems >>>>>", res);
      this.gs.isSpinnerShow = false;
      this.checklist = res;
      for (let i in this.checklist) {
        this.checklist[i].satisfactory = true;
        this.checklist[i].status = "Satisfactory";
      }
    });
  }
  GetPostMasterInspectionLineItems() {
    const body = {
      bookingId: this.bookingDetails.bookingId
    }
    this.gs.isSpinnerShow = true;
    this.bookingService.GetPostMasterInspectionLineItems(body).subscribe((res: any) => {
      console.log("GetPostMasterInspectionLineItems >>>>>", res);
      this.gs.isSpinnerShow = false;
      this.checklist = res;
      for (let i in this.checklist) {
        // this.checklist[i].satisfactory = true;
        if (this.checklist[i].selectedResult === "Satisfactory") {
          this.checklist[i].satisfactory = true;
        }
        if (this.checklist[i].selectedResult === "Defective") {
          this.checklist[i].defective = true;
        }
        if (this.checklist[i].selectedResult === "N/A") {
          this.checklist[i].na = true;
        }
        this.checklist[i].status = this.checklist[i].selectedResult;
      }
    });
  }

  get insnFormControl(): any {
    return this.inspectionForm.controls;
  }

  onChangeCheck(row: any, slctValue: any) {
    console.log("satisfactory >>>>>", row["satisfactory"]);
    console.log("defective >>>>>", row["defective"]);
    console.log("na >>>>>", row["na"]);

    if (slctValue === "satisfactory" && row[slctValue]) {
      row["defective"] = !row["satisfactory"];
      row["na"] = !row["satisfactory"];
      row.status = "Satisfactory"
    }
    if (slctValue === "defective" && row[slctValue]) {
      row["satisfactory"] = !row["defective"];
      row["na"] = !row["defective"];
      row.status = "Defective"
    }
    if (slctValue === "na" && row[slctValue]) {
      row["satisfactory"] = !row["na"];
      row["defective"] = !row["na"];
      row.status = "N/A"
    }

    // for (let [key, value] of Object.entries(row)) {
    //   console.log("key >>>>>>", key);
    //   if (key !== slctValue) {
    //     row[key] = !row[slctValue];
    //   }
    // }
    // row.map((obj: any) => {
    //   console.log("obj >>>>>>>", obj);

    //   if (obj[slctValue] && obj !== slctValue) {
    //     return { ...obj, emp_name: "rahul" };
    //   }
    // });
  }

  onSubmit() {
    console.log("checklist >>>>>>", this.checklist);
    console.log("this.inspectionForm >>>>>>", this.inspectionForm);

    this.submitted = true;
    if (this.inspectionForm.valid) {
      let checkListItems: any = [];
      let inspectionTypeId = this.checklist[0].inspectionTypeId;
      const inspectionDate = this.transformDate(new Date(), 'MM/dd/yy');

      for (let i in this.checklist) {
        checkListItems.push({
          "lineItemId": this.checklist[i].id,
          "name": this.checklist[i].name,
          "status": this.checklist[i].status,
          "lineItemcomments": null
        })
      }

      const body = {
        "bookingId": this.bookingDetails.bookingId,
        "contractId": null,
        "riskId": this.bookingDetails.riskId,
        "riskType": this.bookingDetails.riskType,
        "userId": this.gs.loggedInUserInfo.userId, // "c5c9b193-64ec-46ae-b1a1-f646bc1e0933" // this.gs.loggedInUserInfo.userId
        "inspectionTypeId": inspectionTypeId,
        "inspectorName": this.inspectionForm.value.inspectorName,
        "inspectionDate": inspectionDate,
        "vehicleType": null,
        "licensePlateNumber": this.inspectionForm.value.licensePlateNumber,
        "vinNumber": this.inspectionForm.value.vinNumber,
        "odometerReading": this.inspectionForm.value.odometerReading,
        "fuelLevel": null,
        "overAllCondition": null,
        "comments": null,
        "items": checkListItems
      }
      console.log("body >>>>", body);
      // return;
      this.gs.isSpinnerShow = true;
      if (this.gs.loggedInUserInfo.role === 'user') { // for driver
        this.bookingService.ConfirmVehicleAcceptanceByDriver(body).subscribe((res: any) => {
          console.log("ConfirmVehicleAcceptanceByDriver >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.back();
            this.toast.successToastr(res.message);
          } else {
            this.toast.errorToastr(res.message);
          }
        });
      } else {  // Car Owner
        this.bookingService.ConfirmVehicleReceivedByOwnerfromDriver(body).subscribe((res: any) => {
          console.log("ConfirmVehicleReceivedByOwnerfromDriver >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.back();
            this.toast.successToastr(res.message);
          } else {
            this.toast.errorToastr(res.message);
          }
        });
      }
      // this.activeModal.close({ confirmed: true, reason: this.reason });
    } else {
      this.toast.errorToastr("Please fill the all required fields.")
    }
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  back() {
    this.onCancel.emit(null);
  }

}
