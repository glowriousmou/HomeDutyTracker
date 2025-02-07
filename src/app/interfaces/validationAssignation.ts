import { Assignation } from "./assignation";
import { CritereValidation } from "./critereValidation";

export interface ValidationAssignation {
    id: string;
    idAssignation: string,
    assignation?: Assignation,
    idCritere: string,
    critere?: CritereValidation,
    etat: string,
}
