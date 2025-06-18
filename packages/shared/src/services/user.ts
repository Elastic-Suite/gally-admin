import jwtDecode from 'jwt-decode'

import { IUser, Role } from '../types'

export function isValidUser(user?: IUser | null): boolean {
  return Boolean(user && Date.now() / 1000 < user.exp)
}

export function isValidRoleUser(role: Role, user?: IUser | null): boolean {
  return Boolean(user) && user.roles.includes(role)
}

export function getUser(token?: string): IUser {
  return jwtDecode(token) as IUser
}
