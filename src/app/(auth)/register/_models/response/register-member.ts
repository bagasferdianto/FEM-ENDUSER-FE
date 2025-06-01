export interface RegisterResponse {
    status: number;
    message: string;
    data: Data;
}

export interface Data {
    token: string;
    user: User;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}