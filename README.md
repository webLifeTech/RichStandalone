# RichStandalone
Changes by 02-01-25 to 02-06-25
src\app\modules\user-dashboard\comman\dynamic-form
src\app\modules\user-dashboard\comman\dynamic-grid
src\app\modules\user-dashboard\comman\modal\dynamic-info-modal
src\app\modules\user-dashboard\user-dashboard-kyc
src\app\modules\user-dashboard\widgets\driver-info-details
src\app\shared\services\profile.service.ts


Changes by 31-12-24 to 02-01-25
src\app\modules\user-dashboard\comman\dynamic-form
src\app\modules\user-dashboard\user-dashboard-kyc
src\app\modules\user-dashboard\widgets\driver-info-details
src\app\modules\user-dashboard\comman\modal\driver-info-modal
src\app\shared\components\comman\modal\image-file-modal
src\app\shared\services\global.service.ts
src\app\shared\services\profile.service.ts
src\assets\scss\style.scss line (2447)


 // updatePersonalInfo
  async updatePersonalInfo(finalBody: any) {
    const effectiveDate = this.transformDate(this.todayDate, 'MM/dd/yy');

    let emailTypes: any = await this.profileService.getMasterTypeIds({
      "stateCode": this.kycForm.state || "42",
      "typeCode": 12,
      "effectiveDate": effectiveDate,
    });
    let phoneTypes: any = await this.profileService.getMasterTypeIds({
      "stateCode": this.kycForm.state || "42",
      "typeCode": 13,
      "effectiveDate": effectiveDate,
    });

    let emailTypeIds = emailTypes.find((sItem: any) => sItem.Name == "Personal") || {};
    let phoneTypeIds = phoneTypes.find((sItem: any) => sItem.Name == "Home") || {};


    let Body = {
      "contactId": this.gs.loggedInUserInfo.contactId,
      "userId": this.gs.loggedInUserInfo.userId,
      "phoneTypeId": phoneTypeIds.ID || null,
      "emailTypeId": emailTypeIds.ID || null,
      "pInfo": finalBody
    }

    console.log("Body >>>>>", Body);
    // return
    this.profileService.updatePersonalInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode === "200") {
        this.toast.successToastr("Updated successfully");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }


  createForm() {
    // Group fields by sectionID

    console.log("this.isEditInfo >>>>>>>", this.isEditInfo);
    const groupedSections: any = this.groupBy(this.formArray, 'sectionID');
    Object.keys(groupedSections).forEach((sectionID, index) => {

      const fieldsArray: any = groupedSections[sectionID].sort(
        (a: any, b: any) => a.fieldOrder - b.fieldOrder
      );


      const section: any = this.fb.group({
        sectionID: [sectionID],
        isOpen: [index === 0 ? true : false], // need to do
        isInvalidSection: false,
        sectionName: [fieldsArray[0]?.sectionName || ''],
        modalObject: [fieldsArray[0]?.modalObject || ''],
        tableGrid: [[]], // for table header
        tableGridValueList: [[]], // for table value
        loopArray: this.fb.array([]), // for value
        fields: this.fb.array(
          fieldsArray.map((field: any) =>
            this.fb.group({
              fieldName: [field.fieldName],
              fieldCode: [field.fieldCode],
              description: [field.description],
              fieldType: [field.fieldType],
              isVisible: [field.isVisible],
              isActive: [field.isActive],
              isMandatory: [field.isMandatory],
              isReadOnly: [field.isReadOnly],
              modalValue: [field.modalValue],
              valueCode: [field.modalValueCode], // field.modalValue + "Cd"
              fieldClass: [field.fieldClass],
              modalObject: [field.modalObject],
              checkUnique: [field.checkUnique],
              dependentFields: [field.dependentFields ? JSON.parse(field.dependentFields) : []],
              lineBreak: [(field.staticValue && field.staticValue?.includes('col-')) ? field.staticValue : null],
              selectUnique: [field.selectUnique],
              fieldId: [field.fieldId],
              validationType: [field.validationType],
              staticValue: [field.staticValue],
              condition: [parseInt(field.condition)],
              conditionValue: [field.conditionValue],
              isConditionValid: [(field.condition && field.conditionValue) ? false : true],
              dropdownList: [this.masterDropdwonList[field.dropdownValues] || []],
              apiDropdownList: [field.apiDropdownList || []],
              action: [field.action],
              defaultValue: [field.defaultValue],
              // value: [
              //   field.fieldType === "CHECKBOX" ? JSON.parse(field.defaultValue) : field.defaultValue, // field.fieldType !== "DROPDOWN" ?
              //   this.getValidators(field)
              // ],
              value: [
                field.fieldType === "DATE"
                  ? this.parseDate(this.singleDetailInfo && this.singleDetailInfo[field.modalObject] ? this.singleDetailInfo[field.modalObject][field.modalValue] : null)
                  : (this.singleDetailInfo && this.singleDetailInfo[field.modalObject] ? this.singleDetailInfo[field.modalObject][field.modalValue] : field.fieldType === "CHECKBOX" ? JSON.parse(field.defaultValue) : (field.defaultValue || null)),
                this.getValidators(field)
              ],
              valueCd: [
                field.fieldType === "DROPDOWN" && this.singleDetailInfo && this.singleDetailInfo[field.modalObject] && this.singleDetailInfo[field.modalObject][field.modalValueCode]
                  ? this.singleDetailInfo[field.modalObject][field.modalValueCode]
                  : null
              ],
            })
          )
        )
      });
      this.sections.push(section);
      // if (!this.isEditInfo) {
      // } else {
      //   const section: any = this.fb.group({
      //     sectionID: [sectionID],
      //     isOpen: [index === 0 ? true : false], // need to do
      //     isInvalidSection: false,
      //     sectionName: [fieldsArray[0]?.sectionName || ''],
      //     modalObject: [fieldsArray[0]?.modalObject || ''],
      //     tableGrid: [[]], // for table header
      //     tableGridValueList: [[]], // for table value
      //     loopArray: this.fb.array([]), // for value
      //     fields: this.fb.array(
      //       fieldsArray.map((field: any) =>
      //         this.fb.group({
      //           fieldName: [field.fieldName],
      //           fieldCode: [field.fieldCode],
      //           description: [field.description],
      //           fieldType: [field.fieldType],
      //           isVisible: [field.isVisible],
      //           isActive: [field.isActive],
      //           isMandatory: [field.isMandatory],
      //           isReadOnly: [field.isReadOnly],
      //           modalValue: [field.modalValue],
      //           valueCode: [field.modalValueCode], // + "Cd"
      //           fieldClass: [field.fieldClass],
      //           modalObject: [field.modalObject],
      //           dependentFields: [field.dependentFields ? JSON.parse(field.dependentFields) : []],
      //           lineBreak: [(field.staticValue && field.staticValue?.includes('col-')) ? field.staticValue : null],
      //           selectUnique: [field.selectUnique],
      //           fieldId: [field.fieldId],
      //           validationType: [field.validationType],
      //           staticValue: [field.staticValue],
      //           condition: [parseInt(field.condition)],
      //           conditionValue: [field.conditionValue],
      //           isConditionValid: [(field.condition && field.conditionValue) ? false : true],
      //           dropdownList: [this.masterDropdwonList[field.dropdownValues] || []],
      //           apiDropdownList: [field.apiDropdownList || []],
      //           action: [field.action],
      //           valueCd: [field.fieldType === "DROPDOWN" ? this.singleDetailInfo[field.modalObject][field.modalValueCode] : null],
      //           value: [
      //             field.fieldType === "DATE" ? this.parseDate(this.singleDetailInfo[field.modalObject][field.modalValue]) : this.singleDetailInfo[field.modalObject][field.modalValue] || null, //
      //             this.getValidators(field)
      //           ]
      //         })
      //       )
      //     )
      //   });
      //   this.sections.push(section);
      // }
    });


    this.sections.controls.forEach((section: any) => {
      const privFieldsArray = section.get('fields') as FormArray;
      privFieldsArray.controls.forEach((fieldTwo: any) => {
        if (fieldTwo.value.value) {
          if (fieldTwo.value.fieldType === "DROPDOWN") {
            let dataOptions = fieldTwo.value.dropdownList.find((citem: any) => (citem.ID == fieldTwo.value.value || citem.Name == fieldTwo.value.value)) || {};
            if (dataOptions.ID) {
              fieldTwo.get('value')?.setValue(dataOptions.Name);
              this.onChangeDrop(dataOptions, fieldTwo, section)
              if (fieldTwo.get('valueCd')?.value) {
                fieldTwo.get('valueCd')?.setValue(dataOptions.ID);
              } else {
                fieldTwo.addControl("valueCd", new FormControl(dataOptions.ID));
              }
            }
          }
        }
      });
    });

    console.log("sections >>>>>>>", this.sections);

    this.gs.isSpinnerShow = false;
    this.fetchMasterCountriesList();
    this.drivLicnStateDropdownList();
  }


<!-- Vehicle Upload -->
        <div *ngIf="activeKycTab === 7">
          <mat-accordion class="accordion-align">
            <mat-expansion-panel hideToggle [expanded]="section.isOpen" (opened)="section.isOpen = true"
              (closed)="section.isOpen = false" *ngFor="let section of bulkVehicleUploadTabs; let i = index">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  {{ section.title | translate }}
                </mat-panel-title>
                <mat-panel-description>
                  <i class="feather" [ngClass]="{'icon-minus': section.isOpen, 'icon-plus': !section.isOpen}"></i>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <!-- upload_bulk_vehicle -->
              <ng-container *ngIf="section.tab === 'upload_bulk_vehicle'">
                <div class="profile-info-grid">
                  <div class="row m-0 align-items-end">
                    <div class="col-lg-12">
                      <div class="form-group d-sm-flex d-block">
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="upload_type" id="is_inspection_report1"
                            value="single" [(ngModel)]="vehicleUploadType" (change)="onChangeUpload()">
                          <label class="form-check-label ms-2" for="is_inspection_report1">
                            {{ 'userDashboard.kyc.upload_bulk_vehicle.upload_ops1' | translate }}
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="upload_type" id="is_inspection_report2"
                            value="bulk" [(ngModel)]="vehicleUploadType" (change)="onChangeUpload()">
                          <label class="form-check-label ms-2" for="is_inspection_report2">
                            {{ 'userDashboard.kyc.upload_bulk_vehicle.upload_ops2' | translate }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ng-container
                    *ngIf="vehicleUploadType === 'single' || (vehicleUploadType === 'bulk' && isStartGetKyc) ">
                    <app-dynamic-form [kycForm]="kycForm" [formType]="'vehicleUpload'" [isEditInfo]="isEditCarOwnerInfo"
                      (onVehicleUploadSubmit)="onVehicleUploadSubmit()" (cancel)="cancel()"
                      [selectedTabObj]="selectedTabObj"></app-dynamic-form>
                  </ng-container>

                  <ng-container *ngIf="vehicleUploadType === 'bulk' && !isStartGetKyc">
                    <div class="row m-0 align-items-end">
                      <div class="col-lg-4">
                        <div class="form-group">
                          <label>
                            {{ 'userDashboard.kyc.upload_bulk_vehicle.upload_vin_number' | translate }}
                            <span class="mandatory">*</span>
                          </label>
                          <input [(ngModel)]="vin_document_upload" (change)="uploadFile($event)"
                            name="vin_document_upload" type="file" class="form-control open-select" />
                        </div>
                      </div>
                      <div class="col-lg-4">
                        <div class="form-group">
                          <a class="btn btn-solid color2 no-text-transorm me-2">
                            {{ 'userDashboard.kyc.driverInfo.upload' | translate }}
                          </a>
                          <a class="btn btn-theme no-text-transorm">
                            {{ 'userDashboard.kyc.driverInfo.submit' | translate }}
                          </a>
                        </div>
                      </div>

                      <div class="col-lg-12">
                        <div class="table-responsive dashboard-table">
                          <table class="table">
                            <thead class="thead-light">
                              <tr>
                                <th class="text-center">{{'userDashboard.kyc.other_info.serial_number' | translate}}.
                                </th>
                                <th>{{'userDashboard.kyc.upload_bulk_vehicle.vin_number' | translate}}</th>
                                <th>{{'userDashboard.kyc.upload_bulk_vehicle.tlc_plate_number' | translate}}</th>
                                <th>{{'userDashboard.kyc.upload_bulk_vehicle.car_category' | translate}}</th>
                                <th>{{'userDashboard.kyc.upload_bulk_vehicle.fuel_type' | translate}}</th>
                                <th class="text-center">
                                  {{'userDashboard.kyc.upload_bulk_vehicle.kyc' | translate}}
                                </th>
                                <th class="text-center">
                                  {{'userDashboard.kyc.upload_bulk_vehicle.status' | translate}}
                                </th>
                                <th class="text-center">
                                  {{'userDashboard.kyc.upload_bulk_vehicle.action' | translate}}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr *ngFor="let item of allPendingKycVehicleList; let idx = index">
                                <td class="text-center">{{idx+1}}</td>
                                <td class="text-center">{{item.vin_number}}</td>
                                <td class="text-center">{{item.plate_number}}</td>
                                <td class="text-center">{{item.car_category}}</td>
                                <td class="text-center">{{item.fuel_type}}</td>
                                <td class="text-center">
                                  <span *ngIf="item.kyc" class="badge badge-success">
                                    Active
                                  </span>
                                  <button *ngIf="!item.kyc" type="button" (click)="getKyc(item)"
                                    class="btn btn-solid color4 no-text-transorm">
                                    Get KYC
                                  </button>
                                </td>
                                <td class="text-center">
                                  <span *ngIf="item.status === 'Pending'" class="bold text-danger">
                                    {{item.status}}
                                  </span>
                                  <span *ngIf="item.status !== 'Pending'" class="bold text-warning">
                                    {{item.status}}
                                  </span>
                                </td>
                                <td class="text-center">
                                  <button type="button" mat-icon-button [matMenuTriggerFor]="menu"
                                    aria-label="Example icon-button with a menu">
                                    <i class="feather icon-more-vertical"></i>
                                  </button>
                                  <mat-menu #menu="matMenu">
                                    <button type="button" (click)="getKyc(item)" mat-menu-item>
                                      <i class="feather icon-edit"></i>
                                      <span>Edit</span>
                                    </button>
                                    <button type="button" (click)="deleteFormBulk(allPendingKycVehicleList, idx)"
                                      mat-menu-item>
                                      <i class="feather icon-trash"></i>
                                      <span>Delete</span>
                                    </button>
                                  </mat-menu>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </ng-container>
                </div>
              </ng-container>
            </mat-expansion-panel>
          </mat-accordion>
        </div>
