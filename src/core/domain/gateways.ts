export interface AuthorizationGateway {
  authorize(accessToken: string): Promise<AuthorizeResult | null>;
}

export type AuthorizeResult = {
  username: string;
};
