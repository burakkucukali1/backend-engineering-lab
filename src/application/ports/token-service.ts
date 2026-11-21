export interface AccessTokenPayload {
  userId: number;
  email: string;
}

export interface TokenService {
  generateAccessToken(payload: AccessTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
}
