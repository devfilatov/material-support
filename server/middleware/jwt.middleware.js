const { JwtService } = require("../services");

class JwtMiddleware {
  verify(req, res, next) {
    const token = req.header("X-Auth-Token");
    if (JwtService.verify(token)) next();
    else res.status(401).send({ success: false, error: "Unauthorized" });
  }

  hasRole(role) {
    return (req, res, next) => {
      const token = req.header("X-Auth-Token");
      const { payload } = JwtService.decode(token);
      if (payload.role === role) next();
      else res.status(403).send({ success: false, error: "Access Denied" });
    };
  }

  hasAnyRole(roles) {
    return (req, res, next) => {
      const token = req.header("X-Auth-Token");
      const { payload } = JwtService.decode(token);
      if (roles.some((role) => payload.role === role)) next();
      else res.status(403).send({ success: false, error: "Access Denied" });
    };
  }
}

module.exports = new JwtMiddleware();
