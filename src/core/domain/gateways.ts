export interface AuthorizationGateway {
  authorize(accessToken: string): Promise<AuthorizeResult | null>;
}

export type AuthorizeResult = {
  username: string;
};

export interface AuthenticationGateway {
  authenticate(
    username: string,
    password: string,
  ): Promise<AuthenticateResult | null>;
}

export type AuthenticateResult = {
  accessToken: string;
};
