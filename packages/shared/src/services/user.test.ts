import { InvalidTokenError } from 'jwt-decode'
import { getUser, isValidRoleUser, isValidUser } from './user'
import { Role } from '../types'

const user = getUser(
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTk5NTM1NDQsImV4cCI6MTY1OTk4MjM0NCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfQ09OVFJJQlVUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZNE2SHmtm9WgWEMmKGMjpcfEym2ysxC_CVcLtzlpuT3jlT0Zyz4VjoQHdTav9I7s9b2QzpeDNt3Sfrbka8IHcVb_TvZle_vII-TkQGal37RtXxKk_EMMQQlzLRO3zDWYy2I0ZPXv6iMlaSWOya4egOG2s1_tzFf4MnNNm2zEQbjzAtZ_Ij9UBMlSxK19AHvHlKU9AelA-NepjUdl6f4GxYPnyIwZw3PS294Wtffj7Kzw1ZZywDljl1xN_flg70cuO0GGkUqBNHrf7zBjPmXbAZZDAefoyQfVqB2v4GzDJfO847XymvBlHtCCjWx0ThK5afyOGL2MAAZkl-AoNjMcjA'
)
describe('User service', () => {
  describe('isValidUser', () => {
    it('should not validate the user', () => {
      expect(isValidUser()).toEqual(false)
      expect(
        isValidUser({
          exp: Date.now() / 1000 - 100,
          iat: 42,
          roles: [],
          username: 'batman',
        })
      ).toEqual(false)
    })

    it('should validate the user', () => {
      expect(
        isValidUser({
          exp: Date.now() / 1000 + 100,
          iat: 42,
          roles: [],
          username: 'batman',
        })
      ).toEqual(true)
    })
  })

  describe('isValidRoleUser', () => {
    it('should not validate the user role', () => {
      expect(isValidRoleUser(Role.ADMIN)).toEqual(false)
      expect(isValidRoleUser(Role.ADMIN, null)).toEqual(false)
      expect(isValidRoleUser('FAKE_ROLE' as Role, user)).toEqual(false)
    })

    it('should validate the user role', () => {
      expect(isValidRoleUser(Role.ADMIN, user)).toEqual(true)
      expect(isValidRoleUser(Role.CONTRIBUTOR, user)).toEqual(true)
    })
  })

  describe('getUser', () => {
    it('should throw error from empty token', () => {
      expect(() => getUser()).toThrow(InvalidTokenError)
    })

    it('should return the user from token', () => {
      expect(user).toEqual({
        iat: 1659953544,
        exp: 1659982344,
        roles: ['ROLE_ADMIN', 'ROLE_CONTRIBUTOR'],
        username: 'admin@example.com',
      })
    })
  })
})
