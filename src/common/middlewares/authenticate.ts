import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksclient from 'jwks-rsa';
import { Request } from 'express';
import { AuthCookie } from '../types/index';
import config from 'config';

export default expressjwt({
    secret: jwksclient.expressJwtSecret({
        jwksUri: config.get('auth.jwksUri'),
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        const authHeader = req.headers.authorization;
        if (authHeader?.split(' ')[1] !== undefined) {
            const token = authHeader.split(' ')[1];
            if (token) {
                return token;
            }
        }
        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});
