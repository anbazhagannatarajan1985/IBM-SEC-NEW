import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

import { ServiceProvider } from '../../shared/services/service-provider';
import * as models from '../../shared/models';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {

  public formList: models.FormDetailModel[];
  public userType: string = '';
  userSubscription: Subscription;
  public isPendingListPage: boolean = false;
  approverType: string = AppConfig.APPROVER_TYPE;
  tsaType: string = AppConfig.TSA_TYPE;
  requestorType: string = AppConfig.REQUESTOR_TYPE;

  constructor(private serviceProvider: ServiceProvider, private _Activatedroute: ActivatedRoute) {
    this.userType = localStorage.getItem('user_type');
  }

  ngOnInit() {


    this.userSubscription = this._Activatedroute.params.subscribe(
      (params: Params) => {
        if (!!params && !!params['showPendingList'] && params['showPendingList'] === 'true') {
          this.isPendingListPage = true;
          this.getPendingFormList();
        } else {
          this.isPendingListPage = false;
          this.getRequstorFormList();
        }
      });
  }

  getPendingFormList() {
    this.serviceProvider.getPendingApprovalList(localStorage.getItem('current_user'), '2').subscribe(
      (result: models.FormDetailModel[]) => {
        if (!!result) {
          this.formList = result;
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  getRequstorFormList() {
    this.serviceProvider.getRequestorFormList(localStorage.getItem('current_user')).subscribe(
      (result: models.FormDetailModel[]) => {
        if (!!result) {
          this.formList = result;
        }
      },
      err => {

      },
      () => {

      }
    );
  }

  approveForm(formId: string, index: number) {
    this.serviceProvider.approveForm(localStorage.getItem('current_user'), formId).subscribe(
      result => {
        if (!!result && result['status'] === 'Approved') {
          Swal.fire('Confirmation', 'Approved', 'success');
          this.formList.splice(index, 1);
        } else {
          Swal.fire('Info', 'Failed to Approve', 'error');
        }
      },
      err => {
        Swal.fire('Info', 'Failed to Approve', 'error');
      },
      () => {

      }
    );
  }

}
