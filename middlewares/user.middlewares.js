import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    console.log("No access token");
    const tokenGenerated = await generateToken(req, res);
    if (tokenGenerated) {
      console.log("ref done")
      return next();
    }
    console.log("no refresh")
    return;
  } else {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired access token" });
      } else {
        req.email = decoded.email;
        return next();
      }
    });
  }
};

const generateToken = (req, res) => {
  return new Promise((resolve, reject) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      res.status(401).json({ access: false, data: "No valid token" });
      return resolve(false);
    } else {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
        if (err) {
          res.status(401).json({ message: "Invalid or expired refresh token" });
          return resolve(false);
        } else {
          const accessToken = jwt.sign(
            { email: decoded.email },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: "1m" }
          );
          res.cookie("accessToken", accessToken, {
            maxAge: 60000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          });
          return resolve(true);
        }
      });
    }
  });
};

export { verifyUser };
