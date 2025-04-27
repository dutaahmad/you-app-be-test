export interface TokenPayload {
  sub: string;
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}
