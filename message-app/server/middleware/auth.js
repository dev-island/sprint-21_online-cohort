const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
exports.checkJwt = auth({
  audience: "my-express-app",
  // Christian_issuerBaseURL: `https://dev-iwo3s7ya82pzsqds.us.auth0.com`,
  //Andrew_
  issuerBaseURL: `https://dev-6lssfc5bmy8gbdxj.us.auth0.com/`,
});
