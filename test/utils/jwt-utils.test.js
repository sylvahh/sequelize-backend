import Jwt  from "jsonwebtoken";
import JWTUtils from "../../src/config/utils /jwt-utils";

describe('jwt utils', () => {
    it('should return an access token', () => {
        const payload = { email: 'test@examples.com' }
        expect(JWTUtils.generateAccessToken(payload)).toEqual(expect.any(String))
    })

    it('should return an refresh token', () => {
        const payload = { email: 'test@examples.com' }
        expect(JWTUtils.generateRefreshToken(payload)).toEqual(expect.any(String))
    })

    it('should verify that access token is valid', () => {
        const payload = { email: 'test@examples.com' }
        const jwt = JWTUtils.generateAccessToken(payload)
        expect(JWTUtils.verifyAccessToken(jwt)).toEqual(expect.objectContaining(payload))
    })

    
    it('should verify that refresh token is valid', () => {
        const payload = { email: 'test@examples.com' }
        const jwt = JWTUtils.generateRefreshToken(payload)
        expect(JWTUtils.verifyRefreshToken(jwt)).toEqual(expect.objectContaining(payload))
    })
    it('shoul throw error if access token is invalid ', () => {
        expect(() => JWTUtils.verifyAccessToken('invalid-token')).toThrow(
            Jwt.JsonWebTokenError
        )
    })

    it('shoul throw error if refresh token is invalid ', () => {
        expect(() => JWTUtils.verifyRefreshToken('invalid-token')).toThrow(
            Jwt.JsonWebTokenError
        )
    })
})