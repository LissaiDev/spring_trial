export interface User {
    id?: number;
    name: string;
    nickname: string;
    birthDate: string;
    country: string;
    province: string;
    neighborhood: string;
    email: string;
    photoUrl?: string;
}

export interface UserFormData extends Omit<User, "id" | "photoUrl"> {
    photo: File | null;
}
