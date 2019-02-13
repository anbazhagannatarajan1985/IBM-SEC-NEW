import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import { ServiceProvider } from '../../shared/services/service-provider';
import Swal from 'sweetalert2';

import * as models from '../../shared/models';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {

  private formList: models.FormDetailModel[];
  private userType: string = '';

  constructor(private serviceProvider: ServiceProvider) {
    this.userType = localStorage.getItem('user_type');
  }

  ngOnInit() {
    if (this.userType === '2' || this.userType === '1') {
      this.getPendingFormList();
    } else {
      this.getRequstorFormList();
    }
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
