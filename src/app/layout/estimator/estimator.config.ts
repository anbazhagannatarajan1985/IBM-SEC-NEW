

export class EstimatorConfig {

  static FORM_STATUS = [
    { id: '1', value: 'Open' },
    { id: '2', value: 'Pending Approval' },
    { id: '3', value: 'Approved' },
    { id: '4', value: 'Closed' },
  ];

  static getFormStatuses() {
    return [
      { id: '1', value: 'New' },
      { id: '2', value: 'Pending Approval' },
      { id: '3', value: 'Approved' },
      { id: '4', value: 'Closed' },
    ];
  }

  static getFormStatusbyId(id: string) {
    let statuses = this.getFormStatuses();
    let data = statuses.filter(item => id === item.id);
    if (!!data && data.length > 0) {
      return data[0];
    }
  }

  static getDetailFormControls() {
    return ['formId', 'formStatusId', 'formStatus', 'requestorName', 'requestorId', 'riskRating', 'datePrepared',
      'validTo', 'salesConnectNo', 'rfsNo', 'region', 'customerName', 'customerId', 'salesId',
      'approver', 'coe', 'custom'];
  }

  static getEstimatorControls() {
    return ['endPointSecurity', 'serviceWindow', 'serviceScope', 'b5', 'b7', 'b7_1', 'baseFte',
      'totalFte', 'transitionFte'];
  }

  static getServerFormControls() {
    return ['vendor', 'antiMalwareAgent', 'hostIpsOnServers', 'hostFirewallOnServers',
      'noOfConsoles', 'serverFactor', 'serverSupported',
      'hipsEffort', 'hipsFwEffort', 'noOfConsoleEffort', 'fteRoundOff', 'fteForCalculation',
      'serverFactorBaseFte', 'serverSupportedBaseFte',
      'hipsEffortBaseFte', 'hipsFwEffortBaseFte', 'noOfConsoleEffortBaseFte', 'fteRoundOffBaseFte', 'fteForCalculationBaseFte',
      'serverFactorFinalFte', 'serverSupportedFinalFte', 'hipsEffortFinalFte',
      'hipsFwEffortFinalFte', 'noOfConsoleEffortFinalFte', 'fteRoundOffFinalFte', 'fteForCalculationFinalFte'];
  }

  static getWorkstationFormControls() {
    return ['vendor', 'antiMalwareAgent', 'hostIpsOnServers', 'hostFirewallOnServers', 'deviceApplicationControl', 'noOfConsoles',
      'serverFactor', 'serverSupported', 'encryptionEffort', 'hipsEffort', 'hipsFwEffort', 'deviceApplicationControlEffort',
      'noOfConsoleEffort', 'fteRoundOff', 'fteForCalculation', 'serverFactorBaseFte', 'serverSupportedBaseFte',
      'encryptionEffortBaseFte', 'deviceApplicationControlBaseFte', 'hipsEffortBaseFte', 'hipsFwEffortBaseFte', 'noOfConsoleEffortBaseFte',
      'fteRoundOffBaseFte', 'fteForCalculationBaseFte', 'serverFactorFinalFte', 'serverSupportedFinalFte', 'hipsEffortFinalFte',
      'encryptionEffortFinalFte', 'hipsFwEffortFinalFte', 'deviceApplicationControlFinalFte', 'noOfConsoleEffortFinalFte',
      'fteRoundOffFinalFte', 'fteForCalculationFinalFte'];
  }
}
