import { CLEAR, SET_TOKEN, SET_USER, UserAction } from "../actions/user"


export type UserState = {
  token: string | null,
  user: string | null,
}

const initState: UserState = {
  token: null,
  user: null,
}

export const userReducer = (state: UserState = initState, action: UserAction): UserState => {
  switch(action.type){
    case SET_TOKEN :
      return { ...state, token: action.payload }
    case SET_USER :
      return { ...state, user: action.payload }
    case CLEAR :
      return { ...initState }
    default:
      return state
  }
}