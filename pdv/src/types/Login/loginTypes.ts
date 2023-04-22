export interface initialSignUp {
    workplace?: string;
    username: string;
    email: string;
    password: string;
    repetedPassword?: string;
    userType: string;
    hasConsented?: boolean;
    userId: string;
  }

  export  interface initialSignIn {
    userWorkplace: string;
    userEmail: string;
    userPassword: string;
    rememberMe: boolean;
  }