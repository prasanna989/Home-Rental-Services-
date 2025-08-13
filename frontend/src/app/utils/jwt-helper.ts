import * as jwt_decode from 'jwt-decode';

export const decodeJwt = (token: string) => (jwt_decode as any).default(token);
