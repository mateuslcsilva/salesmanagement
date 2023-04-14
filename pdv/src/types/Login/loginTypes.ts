export interface initialSignUp {
    workplace?: string;
    username: string;
    email: string;
    password: string;
    repetedPassword?: string;
    userType: string;
    hasConsented?: boolean;
  }

  export  interface initialSignIn {
    userWorkplace: string;
    userEmail: string;
    userPassword: string;
    rememberMe: boolean;
  }