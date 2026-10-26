const KEYCLOAK =
  "http://localhost:8180/realms/fitness-app/protocol/openid-connect";

export const authConfig = {
  clientId: "fitness-frontend",
  authorizationEndpoint: `${KEYCLOAK}/auth`,
  tokenEndpoint: `${KEYCLOAK}/token`,
  logoutEndpoint: `${KEYCLOAK}/logout`, // was pointing to the master realm
  redirectUri: "http://localhost:5173",
  autoLogin: false,
  scope: "openid profile email offline_access",
  onRefreshTokenExpire: (event) => event.logIn(),
};
