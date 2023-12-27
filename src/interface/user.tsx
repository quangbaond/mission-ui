export interface IUser {
  id: number
  name: string
  email: string
}

export interface ILoginParams {
  email: string
  password: string
  remember: boolean
}
