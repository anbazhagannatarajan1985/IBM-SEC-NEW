
export class AppConfig {

  static APP_NAME = 'throq';

  static APP_URL = 'http://localhost:8080';

  static REQUESTOR_TYPE = 'REQUESTOR';
  static TSA_TYPE = 'TSA';
  static APPROVER_TYPE = 'APPROVER';

  public static SERVICE_WINDOW_OPERATIONS = [
    { id: '1', value: '8*5' },
    { id: '2', value: '16*5' },
    { id: '3', value: '24*5' },
    { id: '4', value: '8*5 with on call' },
    { id: '5', value: '16*5 with on call' },
  ];

  public static SERVICE_SCOPES = [
    { id: 'SERVER', value: 'Servers' },
    { id: 'WORKSTATION', value: 'Workstations' },
  ];

  public static RISK_RATING = [
    { id: 'LOW', value: 'Low' },
    { id: 'MEDIUM', value: 'Medium' },
    { id: 'HIGH', value: 'High' },
  ];
}
