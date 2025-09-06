export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}
