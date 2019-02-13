import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AppConfig } from '../../app.config';
import { LocalStorageService } from '../../shared/LocalStorage.service';



@Injectable()
export class ServiceProvider {


  private handleError(error: any): Observable<any> {

    if (error.status === 500) {
      error.statusText = 'Server is not reachable. Please try again later.'
    } else if (error.status === 0) {
      error.statusText = 'Internal server error occured. Please try again later.'
    }
    return Observable.throw(error);
  }

  constructor(public http: HttpClient, private localStorageService: LocalStorageService) {
    console.log('Hello HttpProvider Provider');
  }



  login(data: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(AppConfig.APP_URL + '/login', data).pipe(map((res: Response) => {
      // if (res['errcode'] !== '00000') {
      //   return [];
      // }
      return res;
    }));
  }

  signup(data: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(AppConfig.APP_URL + '/users/sign-up', data);
  }

  getUserById(username: String) {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/users/loadUser' + '?username=' + username, { headers: headers });
  }

  getUsersByType(type: string) {

    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/users/user-type?type=' + type, { headers: headers });
  }

  getList(url: string) {

    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + url, { headers: headers });
  }

  getNewFormId() {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/form/new-form-id', { headers: headers });
  }

  saveForm(data: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.put(AppConfig.APP_URL + '/form/new-form', data, { headers: headers });
  }

  getFormByFormId(formId: string) {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/form/form?f=' + formId, { headers: headers });
  }

  getTermsAndConditions() {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/form/term-condition', { headers: headers });
  }

  updateTermsAndCondition(data: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.put(AppConfig.APP_URL + '/form/term-condition', data, { headers: headers });
  }

  getPendingApprovalList(approver: string, status: string) {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/form/pending-approval?a=' + approver + '&s=' + status, { headers: headers });
  }

  getRequestorFormList(requestor: string) {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/form/requestor-forms?r=' + requestor, { headers: headers });
  }

  approveForm(approver: string, formId: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.put(AppConfig.APP_URL + '/form/approve?a=' + approver + '&f=' + formId, { headers: headers });
  }

  download() {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(AppConfig.APP_URL + '/form/download-form?formId=IBMSEC-1927678443', { headers: headers });
  }

}
