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
