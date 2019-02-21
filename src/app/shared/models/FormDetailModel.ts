import { EstimatorModel, ServerModel, WorkstationModel } from '../../shared/models';


export interface FormDetailModel {
  id?: string;
  formId?: string;
  formStatus?: string;
  requestorName?: string;
  requestorId?: string;
  riskRating?: string;
  datePrepared?: string;
  validTo?: string;
  salesConnectNo?: string;
  rfsNo?: string;
  region?: string;
  coe?: string;
  customerName?: string;
  customerId?: string;
  salesId?: string;
  approver?: string;
  custom?: string;
  endPoint?: string;
  serviceWindow?: string;
  serviceScope?: string;
  vendor?: string;
  noOfServers?: number;
  noOfConsoles?: number;

  estimatorDetails?: EstimatorModel;
  // serverDetails?: ServerModel;
  // workstationDetails?: WorkstationModel;

}
