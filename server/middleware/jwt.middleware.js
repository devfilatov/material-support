const { JwtService } = require("../services");

class JwtMiddleware {
  verify(req, res, next) {
    const token = req.header("X-Auth-Token");
    const valid = JwtService.verify(token);
    if (valid) next();
    else res.status(401).send({ success: false, error: "Unauthorized" });
  }

  hasRole(role) {
    return (req, res, next) => {
      const token = req.header("X-Auth-Token");
      const decoded = JwtService.decode(token);
      const foundRole = decoded.payload.roles.find((r) => role === r);
      if (foundRole) next();
      else res.status(403).send({ success: false, error: "Access Denied" });
    };
  }

  hasAllRoles(roles) {
    return (req, res, next) => {
      const token = req.header("X-Auth-Token");
      const decoded = JwtService.decode(token);
      const foundAllRole = roles.every((role) =>
        decoded.payload.roles.find((r) => role === r)
      );
      if (foundAllRoles) next();
      else res.status(403).send({ success: false, error: "Access Denied" });
    };
  }

  hasAnyRole(roles) {
    return (req, res, next) => {
      const token = req.header("X-Auth-Token");
      const decoded = JwtService.decode(token);
      const foundAnyRole = roles.some((role) =>
        decoded.payload.roles.find((r) => role === r)
      );
      if (foundAnyRole) next();
      else res.status(403).send({ success: false, error: "Access Denied" });
    };
  }
}

module.exports = new JwtMiddleware();
