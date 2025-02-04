import { User } from '@interfaces/user';
export interface FamilyTree extends User {
    // id: number;
    name: string;
    level?: string;
    children?: FamilyTree[];
}
