import jwt from "jsonwebtoken";

const auth = (roles = []) => {
  if (!Array.isArray(roles)) roles = [roles];

  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};
export default auth;

