export const SET_TOKEN = 'SET_TOKEN'
export const SET_USER = 'SET_USER'
export const CLEAR = 'CLEAR'

export type UserAction = {
  type: string,
  payload: any
}

export const set_token_action = (payload: any): UserAction => ({
  type: SET_TOKEN,
  payload,
})

export const set_user_action = (payload: any): UserAction => ({
  type: SET_USER,
  payload,
})

export const logout_action = (payload: any): UserAction => ({
  type: CLEAR,
  payload,
})