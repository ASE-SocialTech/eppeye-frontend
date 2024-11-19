import { CameraResponse } from "./cameraResponse.model";

export interface AreaResponse {

    id: number;
    name: string;
    description: string;
    cameras: CameraResponse[];
}