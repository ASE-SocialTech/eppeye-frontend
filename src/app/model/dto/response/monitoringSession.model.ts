import { ComplianceStatusResponse } from "./complianceStatus.model ";
import { MonitoringIncidentResponse } from "./monitoringIncident.model";

export interface MonitoringSessionResponse {
    id: number;
    startTime: Date;
    endTime: Date;
    status: string;
    incidents: MonitoringIncidentResponse[];
    complianceStatus: ComplianceStatusResponse;
   
}