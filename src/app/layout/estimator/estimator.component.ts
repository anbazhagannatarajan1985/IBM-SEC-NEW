import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { ServiceProvider } from '../../shared/services/service-provider';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import $ from 'jquery';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';


import * as models from '../../shared/models';
import { EstimatorConfig } from 'src/app/layout/estimator/estimator.config';
// import { DatepickerOptions } from 'ng2-datepicker';

declare var $: any;

@Component({
  selector: 'app-estimator',
  templateUrl: './estimator.component.html',
  styleUrls: ['./estimator.component.scss']
})
export class EstimatorComponent implements OnInit {
  userSubscription: Subscription;

  closeResult: string;
  collapseCustomerDetails = false;
  collapseEstimatorDetails = false;
  collapseServerDetails = true;
  collapseWorkstationDetails = true;
  showEstimatorPanel = false;
  servicePanelTitle = '';
  isEndPoint = false;
  isDAS = false;
  isInfra = false;
  isIOM = false;
  isSIOC = false;

  isMalware = false;
  isWebSecurity = false;
  isEmailSecurity = false;
  isVolunerability = false;
  isDlp = false;

  isServerScope = false;
  isWorkstationScope = false;

  serviceOperations: any[] = AppConfig.SERVICE_WINDOW_OPERATIONS;
  serviceScopes: any[] = AppConfig.SERVICE_SCOPES;

  isToggleSearchClicked = false;
  approverList: models.UserModel = {};
  regionList: models.RegionModel = {};
  vendorList: any = {};
  riskRatings: any = {};

  estimatorForm: FormGroup;
  detailsForm: FormGroup;
  serverForm: FormGroup;
  workstationForm: FormGroup;
  termsAndConditionForm: FormGroup;
  searchForm: FormGroup;

  detailsFormSubmitted = false;
  currentForm: models.FormDetailModel = {};
  estimatorModel: models.EstimatorModel = {};
  serverModel: models.ServerModel = {};
  workstationModel: models.WorkstationModel = {};
  nextFormId: string;
  hostIpsOnServer: boolean = false;
  hostFirewallOnServer: boolean = false;
  hostIpsOnWorkstation: boolean = false;
  hostFirewallOnWorkstation: boolean = false;
  deviceApplicationControl: boolean = false;
  isCoeValid: boolean = true;
  isEndPointValid: boolean = true;
  downloadURL: string;
  termsAndConditions: models.TermsAndConditionModel = {};
  editTermsAndConditionsClicked: boolean = false;
  public submittedFormIdToDownload: string = '';
  public editor;
  public editorContent = ``;
  public editorOptions = {
    placeholder: ''
  };

  myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'd-m-yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    satHighlight: true,
    inline: false,
    markCurrentDay: true,
    markCurrentMonth: true,
    markCurrentYear: true,
    monthSelector: true,
    yearSelector: true,
    showTodayBtn: true,
    height: '30px',
  };

  // Initialized to specific date (09.10.2018).
  public datePreparedModel: any;
  validToModel: any;
  isView: boolean = false;


  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private serviceProvider: ServiceProvider, private datePipe: DatePipe,
    private _Activatedroute: ActivatedRoute) {

    this.downloadURL = AppConfig.APP_URL + '/form/download-form';
    this.getUsersByType(AppConfig.APPROVER_TYPE);
    this.getRegionList();
    this.getTermsAndConditions();
    this.riskRatings = AppConfig.RISK_RATING;

    const currentDate = moment().toDate();
    const dateStr = datePipe.transform(currentDate, 'dd-MM-yyyy');
    let dateArr = dateStr.split('-');
    this.datePreparedModel = { date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] } };
    this.validToModel = { date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] } };



  }

  ngOnInit() {
    this.addFormControl();
    this.getNextFormId();
    this.getVendorList();

    const currentDate = moment().toDate();
    const dateStr = this.datePipe.transform(currentDate, 'dd-MM-yyyy');
    let dateArr = dateStr.split('-');
    this.datePreparedModel = {
      date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] },
      formatted: dateArr[0] + '-' + dateArr[1] + '-' + dateArr[2]
    };
    this.validToModel = {
      date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] },
      formatted: dateArr[0] + '-' + dateArr[1] + '-' + dateArr[2]
    };


    const status = EstimatorConfig.getFormStatusbyId('1');
    if (!!status) {
      this.detailsForm.get('formStatus').setValue(status.value);
      this.detailsForm.get('formStatusId').setValue('1');
    }


    // this.detailsForm.get('datePrepared').setValue();

    this.userSubscription = this._Activatedroute.params.subscribe(
      (params: Params) => {
        debugger
        const selectedFormId = params['formId'];
        if (params['isView'] === 'true') {
          this.isView = true;
        } else {
          this.isView = false;
        }

        if (!!selectedFormId && selectedFormId !== '') {
          this.loadForm(selectedFormId);
          this.submittedFormIdToDownload = selectedFormId;
        }

      });


  }

  addFormControl() {
    this.searchForm = this.formBuilder.group({
      searchFormId: [''],
    });

    this.detailsForm = this.formBuilder.group({
      formId: ['', Validators.required],
      formStatusId: ['', Validators.required],
      formStatus: ['', Validators.required],
      requestorName: [localStorage.getItem('current_user_name'), Validators.required],
      requestorId: [localStorage.getItem('current_user'), Validators.required],
      riskRating: ['', Validators.required],
      datePrepared: ['', Validators.required],
      validTo: ['', Validators.required],
      salesConnectNo: ['', Validators.required],
      rfsNo: ['', Validators.required],
      region: ['', Validators.required],
      customerName: ['', Validators.required],
      customerId: ['', Validators.required],
      salesId: ['', Validators.required],
      approver: ['', Validators.required],
      custom: ['', Validators.required],
      coe: ['', Validators.required]
    });

    this.estimatorForm = this.formBuilder.group({
      endPointSecurity: ['', Validators.required],
      serviceWindow: ['', Validators.required],
      serviceScope: ['', Validators.required],
      b5: [''],
      b7: [''],
      b7_1: [''],
      baseFte: [''],
      totalFte: [''],
      transitionFte: [''],
    });

    this.serverForm = this.formBuilder.group({
      vendor: ['', Validators.required],
      antiMalwareAgent: ['', Validators.required],
      hostIpsOnServers: [false],
      hostFirewallOnServers: [false],
      noOfConsoles: ['', Validators.required],
      serverFactor: [''],
      serverSupported: [''],
      hipsEffort: [''],
      hipsFwEffort: [''],
      noOfConsoleEffort: [''],
      fteRoundOff: [''],
      fteForCalculation: [''],
      serverFactorBaseFte: [''],
      serverSupportedBaseFte: [''],
      hipsEffortBaseFte: [''],
      hipsFwEffortBaseFte: [''],
      noOfConsoleEffortBaseFte: [''],
      fteRoundOffBaseFte: [''],
      fteForCalculationBaseFte: [''],
      serverFactorFinalFte: [''],
      serverSupportedFinalFte: [''],
      hipsEffortFinalFte: [''],
      hipsFwEffortFinalFte: [''],
      noOfConsoleEffortFinalFte: [''],
      fteRoundOffFinalFte: [''],
      fteForCalculationFinalFte: [''],
    });

    this.workstationForm = this.formBuilder.group({
      vendor: ['', Validators.required],
      antiMalwareAgent: ['', Validators.required],
      hostIpsOnServers: [false],
      hostFirewallOnServers: [false],
      deviceApplicationControl: [false],
      noOfConsoles: ['', Validators.required],
      serverFactor: [''],
      serverSupported: [''],
      encryptionEffort: [''],
      hipsEffort: [''],
      hipsFwEffort: [''],
      deviceApplicationControlEffort: [''],
      noOfConsoleEffort: [''],
      fteRoundOff: [''],
      fteForCalculation: [''],
      serverFactorBaseFte: [''],
      serverSupportedBaseFte: [''],
      encryptionEffortBaseFte: [''],
      hipsEffortBaseFte: [''],
      hipsFwEffortBaseFte: [''],
      deviceApplicationControlBaseFte: [''],
      noOfConsoleEffortBaseFte: [''],
      fteRoundOffBaseFte: [''],
      fteForCalculationBaseFte: [''],
      serverFactorFinalFte: [''],
      serverSupportedFinalFte: [''],
      encryptionEffortFinalFte: [''],
      hipsEffortFinalFte: [''],
      hipsFwEffortFinalFte: [''],
      deviceApplicationControlFinalFte: [''],
      noOfConsoleEffortFinalFte: [''],
      fteRoundOffFinalFte: [''],
      fteForCalculationFinalFte: [''],
    });

    this.termsAndConditionForm = this.formBuilder.group({
      termsAndCondition: [this.termsAndConditions.termsAndCondition, Validators.required]
    });
  }

  get f() { return this.estimatorForm.controls; }

  onSubmit() { }

  collapseCustomerDetailSelected() {
    this.collapseCustomerDetails = !this.collapseCustomerDetails;
  }

  collapseEstimatorSelected() {
    this.collapseEstimatorDetails = !this.collapseEstimatorDetails;
  }

  collapseServerDetailSelected() {
    this.collapseServerDetails = !this.collapseServerDetails;
  }
  collapseWorkstationDetailSelected() {
    this.collapseWorkstationDetails = !this.collapseWorkstationDetails;
  }

  endPointSelected(event: boolean) {
    this.detailsForm.get('coe').setValue('END_POINT');
    this.setAction(event, false, false, false, false);
    this.setServiceAction(false, false, false, false, false);
  }

  dasSelected(event: boolean) {
    this.detailsForm.get('coe').setValue('DAS');
    this.setAction(false, event, false, false, false);
    this.setServiceAction(false, false, false, false, false);
  }

  infraSelected(event: boolean) {
    this.detailsForm.get('coe').setValue('INFRA');
    this.setAction(false, false, event, false, false);
    this.setServiceAction(false, false, false, false, false);
  }

  iomSelected(event: boolean) {
    this.detailsForm.get('coe').setValue('IOM');
    this.setAction(false, false, false, event, false);
    this.setServiceAction(false, false, false, false, false);
  }

  siocSelected(event: boolean) {
    this.detailsForm.get('coe').setValue('SIOC');
    this.setAction(false, false, false, false, event);
    this.setServiceAction(false, false, false, false, false);
  }

  malwareSelected(event: boolean) {
    this.setServiceAction(event, false, false, false, false);
  }

  webSecuritySelected(event: boolean) {
    this.setServiceAction(false, event, false, false, false);
  }

  emailSecuritySelected(event: boolean) {
    this.setServiceAction(false, false, event, false, false);
  }

  VolunerabilitySelected(event: boolean) {
    this.setServiceAction(false, false, false, event, false);
  }

  dlpSelected(event: boolean) {
    this.setServiceAction(false, false, false, false, event);
  }

  setAction(isEndPoint: boolean, isDAS: boolean, isInfra: boolean, isIOM: boolean, isSIOC: boolean) {
    this.isEndPoint = isEndPoint;
    this.isDAS = isDAS;
    this.isInfra = isInfra;
    this.isIOM = isIOM;
    this.isSIOC = isSIOC;
  }

  setServiceAction(isMalware: boolean, isWebSecurity: boolean, isEmailSecurity: boolean, isVolunerability: boolean, isDlp: boolean) {
    this.isMalware = isMalware;
    this.isWebSecurity = isWebSecurity;
    this.isEmailSecurity = isEmailSecurity;
    this.isVolunerability = isVolunerability;
    this.isDlp = isDlp;
    this.showEstimatorPanel = true;

    if (isMalware) {
      this.estimatorForm.get('endPointSecurity').setValue('MALWARE');
      this.servicePanelTitle = 'Malware';
    } else if (isWebSecurity) {
      this.estimatorForm.get('endPointSecurity').setValue('WEB-SEC');
      this.servicePanelTitle = 'Web Security';
    } else if (isEmailSecurity) {
      this.estimatorForm.get('endPointSecurity').setValue('EMAIL-SEC');
      this.servicePanelTitle = 'Email Security';
    } else if (isVolunerability) {
      this.estimatorForm.get('endPointSecurity').setValue('VOL_MGMT');
      this.servicePanelTitle = 'Volunerability Management';
    } else if (isDlp) {
      this.estimatorForm.get('endPointSecurity').setValue('DLP');
      this.servicePanelTitle = 'DLP';
    } else {
      this.showEstimatorPanel = false;
    }
  }

  serviceScopeChange() {
    const scope = this.f.serviceScope.value;
    if (!!scope) {
      if (scope === 'SERVER') {
        this.isServerScope = true;
        this.isWorkstationScope = false;
      } else if (scope === 'WORKSTATION') {
        this.isWorkstationScope = true;
        this.isServerScope = false;
      } else if (scope === 'SERVER-WORKSTATION') {
        this.isServerScope = true;
        this.isWorkstationScope = true;
      } else {
        this.isServerScope = false;
        this.isWorkstationScope = false;
      }
    } else {
      this.isServerScope = false;
      this.isWorkstationScope = false;
    }
  }

  hostIpsOnServerChanged(event: any) {
    this.hostIpsOnServer = event;
    this.serverForm.get('hostIpsOnServers').setValue(event);
  }

  hostFirewallOnServerChanged(event: any) {
    this.hostFirewallOnServer = event;
    this.serverForm.get('hostFirewallOnServers').setValue(event);
  }

  hostIpsOnWorkStationChanged(event: any) {
    this.hostIpsOnWorkstation = event;
    this.workstationForm.get('hostIpsOnServers').setValue(event);
  }

  hostFirewallOnWorkStationChanged(event: any) {
    this.hostFirewallOnWorkstation = event;
    this.workstationForm.get('hostFirewallOnServers').setValue(event);
  }

  deviceApplicationControlChanged(event: any) {
    this.deviceApplicationControl = event;
    this.workstationForm.get('deviceApplicationControl').setValue(event);
  }


  toggleSearch() {
    this.isToggleSearchClicked = !this.isToggleSearchClicked;
  }

  closeSearch() {
    this.isToggleSearchClicked = false;
  }

  SearchFormById() {
    const formId = this.searchForm.get('searchFormId').value;
    this.serviceProvider.getFormByFormId(formId).subscribe(
      result => {
        this.isView = true;
        if (localStorage.getItem('user_type') !== '3') {
          this.isView = false;
        }
        this.currentForm = result;
        this.setFormFields(this.currentForm);
      },
      err => {
        Swal.fire('Oops', 'Failed to load form. Please try again', 'error');
      },
      () => {

      }
    );
  }

  get df() {
    return this.detailsForm.controls;
  }

  get ef() {
    return this.estimatorForm.controls;
  }

  get sf() {
    return this.serverForm.controls;
  }

  get wf() {
    return this.workstationForm.controls;
  }

  loadForm(formId: string) {
    this.serviceProvider.getFormByFormId(formId).subscribe(
      result => {
        this.currentForm = result;
        this.setFormFields(this.currentForm);
      },
      err => {
        Swal.fire('Oops', 'Failed to load form. Please try again', 'error');
      },
      () => {

      }
    );
  }

  saveForm() {

    this.detailsFormSubmitted = true;
    this.currentForm.formStatus = '2';
    const status = EstimatorConfig.getFormStatusbyId('2');
    if (!!status) {
      this.detailsForm.get('formStatus').setValue(status.value);
    }

    if (!this.detailsForm.get('coe').valid) {
      this.isCoeValid = false;
    }

    if (!this.estimatorForm.get('endPointSecurity').valid) {
      this.isEndPointValid = false;
    }
    // if (!this.detailsForm.valid || !this.estimatorForm.valid || !this.serverForm.valid || !this.workstationForm.valid) {
    if (this.detailsForm.valid && this.estimatorForm.valid
      && (!this.isServerScope || this.serverForm.valid)
      && (!this.isWorkstationScope || this.workstationForm.valid)) {

      this.setValuesToSave();
      this.currentForm.estimatorDetails = this.estimatorModel;
      this.currentForm.serverDetails = this.serverModel;
      this.currentForm.workstationDetails = this.workstationModel;


      this.serviceProvider.saveForm(this.currentForm).subscribe(
        result => {
          this.submittedFormIdToDownload = this.currentForm.formId;
          Swal.fire('Confirmation', 'Form ' + this.currentForm.formId + ' created successfully....', 'success');
          this.resetFormFields();
        },
        err => {
          Swal.fire('Oops', 'Failed to create form. Please try again', 'error');
        },
        () => {

        }
      );
    } else {
      Swal.fire('Oops', 'Some of the fields are empty', 'info');
    }
  }

  /**
   * get approvers list
   *
   * @param type
   */
  getUsersByType(type: string) {
    this.serviceProvider.getUsersByType(type).subscribe(
      result => {
        if (!!result) {
          this.approverList = result;
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  /**
   * get region list
   */
  getRegionList() {
    this.serviceProvider.getList('/form/regions').subscribe(
      result => {
        if (!!result) {
          this.regionList = result;
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  getVendorList() {
    this.serviceProvider.getList('/form/vendors').subscribe(
      result => {
        if (!!result) {
          this.vendorList = result;
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  getNextFormId() {
    this.serviceProvider.getNewFormId().subscribe(
      result => {
        if (!!result) {
          this.detailsForm.get('formId').setValue('IBMSEC-' + result);
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  setValuesToSave() {
    debugger
    this.currentForm.formId = this.detailsForm.get('formId').value;
    this.currentForm.requestorId = this.detailsForm.get('requestorId').value;
    this.currentForm.requestorName = this.detailsForm.get('requestorName').value;
    this.currentForm.riskRating = this.detailsForm.get('riskRating').value;
    this.currentForm.datePrepared = this.detailsForm.get('datePrepared').value['formatted'];
    this.currentForm.validTo = this.detailsForm.get('validTo').value['formatted'];
    this.currentForm.salesConnectNo = this.detailsForm.get('salesConnectNo').value;
    this.currentForm.rfsNo = this.detailsForm.get('rfsNo').value;
    this.currentForm.region = this.detailsForm.get('region').value;
    this.currentForm.customerName = this.detailsForm.get('customerName').value;
    this.currentForm.customerId = this.detailsForm.get('customerId').value;
    this.currentForm.salesId = this.detailsForm.get('salesId').value;
    this.currentForm.approver = this.detailsForm.get('approver').value;
    this.currentForm.custom = this.detailsForm.get('custom').value;
    this.currentForm.coe = this.detailsForm.get('coe').value;

    this.estimatorModel.endPointSecurity = this.estimatorForm.get('endPointSecurity').value;
    this.estimatorModel.serviceWindow = this.estimatorForm.get('serviceWindow').value;
    this.estimatorModel.serviceScope = this.estimatorForm.get('serviceScope').value;
    this.estimatorModel.b5 = this.estimatorForm.get('b5').value;
    this.estimatorModel.b7 = this.estimatorForm.get('b7').value;
    this.estimatorModel.b71 = this.estimatorForm.get('b7_1').value;
    this.estimatorModel.baseFte = this.estimatorForm.get('baseFte').value;
    this.estimatorModel.totalFte = this.estimatorForm.get('totalFte').value;
    this.estimatorModel.transitionFte = this.estimatorForm.get('transitionFte').value;

    this.serverModel.vendor = this.serverForm.get('vendor').value;
    this.serverModel.antiMalwareAgent = this.serverForm.get('antiMalwareAgent').value;
    this.serverModel.hostIpsOnServers = this.serverForm.get('hostIpsOnServers').value;
    this.serverModel.hostFirewallOnServers = this.serverForm.get('hostFirewallOnServers').value;
    this.serverModel.noOfConsoles = this.serverForm.get('noOfConsoles').value;
    this.serverModel.serverFactor = this.serverForm.get('serverFactor').value;
    this.serverModel.serverSupported = this.serverForm.get('serverSupported').value;
    this.serverModel.hipsEffort = this.serverForm.get('hipsEffort').value;
    this.serverModel.hipsFwEffort = this.serverForm.get('hipsFwEffort').value;
    this.serverModel.noOfConsoleEffort = this.serverForm.get('noOfConsoleEffort').value;
    this.serverModel.fteRoundOff = this.serverForm.get('fteRoundOff').value;
    this.serverModel.fteForCalculation = this.serverForm.get('fteForCalculation').value;
    this.serverModel.serverFactorBaseFte = this.serverForm.get('serverFactorBaseFte').value;
    this.serverModel.serverSupportedBaseFte = this.serverForm.get('serverSupportedBaseFte').value;
    this.serverModel.hipsEffortBaseFte = this.serverForm.get('hipsEffortBaseFte').value;
    this.serverModel.hipsFwEffortBaseFte = this.serverForm.get('hipsFwEffortBaseFte').value;
    this.serverModel.noOfConsoleEffortBaseFte = this.serverForm.get('noOfConsoleEffortBaseFte').value;
    this.serverModel.fteRoundOffBaseFte = this.serverForm.get('fteRoundOffBaseFte').value;
    this.serverModel.fteForCalculationBaseFte = this.serverForm.get('fteForCalculationBaseFte').value;
    this.serverModel.serverFactorFinalFte = this.serverForm.get('serverFactorFinalFte').value;
    this.serverModel.serverSupportedFinalFte = this.serverForm.get('serverSupportedFinalFte').value;
    this.serverModel.hipsEffortFinalFte = this.serverForm.get('hipsEffortFinalFte').value;
    this.serverModel.hipsFwEffortFinalFte = this.serverForm.get('hipsFwEffortFinalFte').value;
    this.serverModel.noOfConsoleEffortFinalFte = this.serverForm.get('noOfConsoleEffortFinalFte').value;
    this.serverModel.fteRoundOffFinalFte = this.serverForm.get('fteRoundOffFinalFte').value;
    this.serverModel.fteForCalculationFinalFte = this.serverForm.get('fteForCalculationFinalFte').value;

    this.workstationModel.vendor = this.workstationForm.get('vendor').value;
    this.workstationModel.antiMalwareAgent = this.workstationForm.get('antiMalwareAgent').value;
    this.workstationModel.hostIpsOnServers = this.workstationForm.get('hostIpsOnServers').value;
    this.workstationModel.hostFirewallOnServers = this.workstationForm.get('hostFirewallOnServers').value;
    this.workstationModel.noOfConsoles = this.workstationForm.get('noOfConsoles').value;
    this.workstationModel.serverFactor = this.workstationForm.get('serverFactor').value;
    this.workstationModel.serverSupported = this.workstationForm.get('serverSupported').value;
    this.workstationModel.encryptionEffort = this.workstationForm.get('encryptionEffort').value;
    this.workstationModel.hipsEffort = this.workstationForm.get('hipsEffort').value;
    this.workstationModel.hipsFwEffort = this.workstationForm.get('hipsFwEffort').value;
    this.workstationModel.noOfConsoleEffort = this.workstationForm.get('noOfConsoleEffort').value;
    this.workstationModel.fteRoundOff = this.workstationForm.get('fteRoundOff').value;
    this.workstationModel.fteForCalculation = this.workstationForm.get('fteForCalculation').value;
    this.workstationModel.serverFactorBaseFte = this.workstationForm.get('serverFactorBaseFte').value;
    this.workstationModel.serverSupportedBaseFte = this.workstationForm.get('serverSupportedBaseFte').value;
    this.workstationModel.encryptionEffortBaseFte = this.workstationForm.get('encryptionEffortBaseFte').value;
    this.workstationModel.hipsEffortBaseFte = this.workstationForm.get('hipsEffortBaseFte').value;
    this.workstationModel.hipsFwEffortBaseFte = this.workstationForm.get('hipsFwEffortBaseFte').value;
    this.workstationModel.noOfConsoleEffortBaseFte = this.workstationForm.get('noOfConsoleEffortBaseFte').value;
    this.workstationModel.fteRoundOffBaseFte = this.workstationForm.get('fteRoundOffBaseFte').value;
    this.workstationModel.fteForCalculationBaseFte = this.workstationForm.get('fteForCalculationBaseFte').value;
    this.workstationModel.serverFactorFinalFte = this.workstationForm.get('serverFactorFinalFte').value;
    this.workstationModel.serverSupportedFinalFte = this.workstationForm.get('serverSupportedFinalFte').value;
    this.workstationModel.encryptionEffortFinalFte = this.workstationForm.get('encryptionEffortFinalFte').value;
    this.workstationModel.hipsEffortFinalFte = this.workstationForm.get('hipsEffortFinalFte').value;
    this.workstationModel.hipsFwEffortFinalFte = this.workstationForm.get('hipsFwEffortFinalFte').value;
    this.workstationModel.noOfConsoleEffortFinalFte = this.workstationForm.get('noOfConsoleEffortFinalFte').value;
    this.workstationModel.fteRoundOffFinalFte = this.workstationForm.get('fteRoundOffFinalFte').value;
    this.workstationModel.fteForCalculationFinalFte = this.workstationForm.get('fteForCalculationFinalFte').value;
    this.workstationModel.deviceApplicationControl = this.workstationForm.get('deviceApplicationControl').value;
    this.workstationModel.deviceApplicationControlEffort = this.workstationForm.get('deviceApplicationControlEffort').value;
    this.workstationModel.deviceApplicationControlBaseFte = this.workstationForm.get('deviceApplicationControlBaseFte').value;
    this.workstationModel.deviceApplicationControlFinalFte = this.workstationForm.get('deviceApplicationControlFinalFte').value;
  }


  open(termsAndConditonModel) {
    this.modalService.open(termsAndConditonModel, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getTermsAndConditions() {
    this.serviceProvider.getTermsAndConditions().subscribe(
      result => {
        if (!!result) {
          this.termsAndConditions = result;
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  editTermsAndConditions() {
    this.editorContent = this.termsAndConditions.termsAndCondition;
    this.editTermsAndConditionsClicked = true;
  }

  onEditorBlured(quill) {
    console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    console.log('quill content is changed!', quill, html, text);
  }

  saveTermsAndConditions() {
    this.termsAndConditions.termsAndCondition = this.termsAndConditionForm.get('termsAndCondition').value;
    this.termsAndConditions.createdBy = localStorage.getItem('current_user');
    this.serviceProvider.updateTermsAndCondition(this.termsAndConditions).subscribe(
      result => {
        if (!!result) {
          this.termsAndConditionForm.get('termsAndCondition').setValue('');
          this.termsAndConditions = result;
          this.editorContent = this.termsAndConditions.termsAndCondition;
          this.editTermsAndConditionsClicked = false;
          // this.modalService.dismissAll();
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  setFormFields(formDetail: models.FormDetailModel) {
    debugger
    const detailFormControls = EstimatorConfig.getDetailFormControls();
    for (const control of detailFormControls) {
      this.detailsForm.get(control).setValue(formDetail[control]);
    }

    let dateArr = formDetail.datePrepared.split('-');
    this.datePreparedModel = { date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] } };
    dateArr = formDetail.validTo.split('-');
    this.validToModel = { date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] } };

    const selectedCoe = this.detailsForm.get('coe').value;
    this.setSelectedCoe(selectedCoe);

    const estimatorFormControls = EstimatorConfig.getEstimatorControls();
    for (const control of estimatorFormControls) {
      this.estimatorForm.get(control).setValue(formDetail['estimatorDetails'][control]);
    }

    const scope = this.estimatorForm.get('serviceScope').value;
    if (scope === 'SERVER') {
      this.isServerScope = true;
    } else if (scope === 'WORKSTATION') {
      this.isWorkstationScope = true;
    } else {
      this.isServerScope = true;
      this.isWorkstationScope = true;
    }

    const selectedService = this.estimatorForm.get('endPointSecurity').value;
    this.setSelectedServiceAction(selectedService);

    const serverFormControls = EstimatorConfig.getServerFormControls();
    for (const control of serverFormControls) {
      this.serverForm.get(control).setValue(formDetail['serverDetails'][control]);
    }

    this.hostIpsOnServer = this.serverForm.get('hostIpsOnServers').value;
    this.hostFirewallOnServer = this.serverForm.get('hostFirewallOnServers').value;

  }

  setSelectedCoe(selectedCoe: string) {
    if (selectedCoe === 'END_POINT') {
      this.setAction(true, false, false, false, false);
    } else if (selectedCoe === 'DAS') {
      this.setAction(false, true, false, false, false);
    } else if (selectedCoe === 'INFRA') {
      this.setAction(false, false, true, false, false);
    } else if (selectedCoe === 'IOM') {
      this.setAction(false, false, false, true, false);
    } else if (selectedCoe === 'SIOC') {
      this.setAction(false, false, false, false, true);
    }
  }

  setSelectedServiceAction(service: string) {
    if (service === 'MALWARE') {
      this.setServiceAction(true, false, false, false, false);
    } else if (service === 'WEB-SEC') {
      this.setServiceAction(false, true, false, false, false);
    } else if (service === 'EMAIL-SEC') {
      this.setServiceAction(false, false, true, false, false);
    } else if (service === 'VOL_MGMT') {
      this.setServiceAction(false, false, false, true, false);
    } else if (service === 'DLP') {
      this.setServiceAction(false, false, false, false, true);
    }
  }

  resetFormFields() {
    this.detailsFormSubmitted = false;
    this.estimatorForm.reset();
    this.serverForm.reset();
    this.workstationForm.reset();
    this.detailsForm.reset();

    this.getNextFormId();
    this.detailsForm.get('requestorName').setValue(localStorage.getItem('current_user_name'));
    this.detailsForm.get('requestorId').setValue(localStorage.getItem('current_user'));
    const status = EstimatorConfig.getFormStatusbyId('1');
    if (!!status) {
      this.detailsForm.get('formStatus').setValue(status.value);
      this.detailsForm.get('formStatusId').setValue('1');
    }

    const currentDate = moment().toDate();
    const dateStr = this.datePipe.transform(currentDate, 'dd-MM-yyyy');
    let dateArr = dateStr.split('-');
    this.datePreparedModel = { date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] } };
    this.validToModel = { date: { year: dateArr[2], month: dateArr[1], day: dateArr[0] } };

    this.hostFirewallOnServer = false;
    this.hostIpsOnServer = false;
    this.hostIpsOnWorkstation = false;
    this.hostFirewallOnWorkstation = false;
    this.deviceApplicationControl = false;

    this.setAction(false, false, false, false, false);
    this.setServiceAction(false, false, false, false, false);

    this.isWorkstationScope = false;
    this.isServerScope = false;

  }


}
