import { MonitoringSessionResponse } from "./monitoringSession.model";
import { PPEConfigurationResponse } from "./ppeConfiguration.model";
import { UserResponse } from "./user.model";

export interface CameraResponse {
    id: number;
    cameraDevice: string;
    user: UserResponse;
    monitoringSessions: MonitoringSessionResponse[];
    ppeConfigurations: PPEConfigurationResponse[];
}