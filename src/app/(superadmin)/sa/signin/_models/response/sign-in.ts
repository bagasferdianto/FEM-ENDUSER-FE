export interface SignInResponse {
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
    createdAt: string;
    updatedAt: string;
}