import { IHydraMember } from './hydra'

export interface IJobProfileInfos {
  label: string
  profile: string
}

export type IJobProfiles = Record<string, IJobProfileInfos>

export interface IJobProfilesByType extends IHydraMember {
  profiles: Record<string, IJobProfiles>
}

export interface ILog {
  id: number
  loggedAt: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'debug'
}
