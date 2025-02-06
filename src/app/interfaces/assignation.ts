
export interface Assignation {
    id?: string;
    idTache: string;
    tache?: string;
    createur?: string;
    idCreateur: string;
    responsable?: string;
    idResponsable: string;
    superviseur?: string;
    idSuperviseur: string;
    statut: string;
    // dateCreation: Date;
    datelimite: Date;
    dateValidation: Date;
}
