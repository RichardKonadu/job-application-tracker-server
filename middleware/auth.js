import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const authorise = async (req, res, next) => {
  if (!req.body.authorisation) {
    return res.status(401).json({ msg: "This route requires a auth token" });
  }

  const token = req.headers.authorisation.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    req.token = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "The authentication is invalid" });
  }
};

export default authorise;
