const passport = require("passport");
const jwt = require("jsonwebtoken");
const ensureAuthenticated = passport.authenticate("jwt", { session: false });

const ensureAuthorized = (roles) => (req, res, next) => {
  if (roles.includes(req.user.roles)) {
    return next();
  }
  return res.status(401).json({
    message: "Unauthorized",
    success: false,
  });
};

const getAuthResults = (req, res, next) => {
  if (ensureAuthenticated) {
    let decodedToken;
    try {
      const token = req.get("Authorization").split(" ")[1];
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.status = 500;
      return res.status(400).json({ message: "Unauthorized Access" });
    }
    if (!decodedToken) {
      const error = new Error("Not authenticated");
      error.status = 401;
      throw error;
    }
    req.userId = decodedToken.user_id;
    req.role = decodedToken.role;
    next();
  }
};

module.exports = {
  ensureAuthenticated,
  ensureAuthorized,
  getAuthResults,
};
