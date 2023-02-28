import { sale } from '../sale/index'
import { item } from '../item'
import { user } from '../user'

export interface initialSignUp {
    workplace: string;
    username: string;
    email: string;
    password: string;
    repetedPassword: string;
    hasConsented: boolean;
  }

  export  interface initialSignIn {
    userWorkplace: string;
    userEmail: string;
    userPassword: string;
  }

  export interface initialWorkplaceSignUp {
        workplace: {
          name: string,
          users: user[],
          items: item[],
          sales: sale[]
        }
  }