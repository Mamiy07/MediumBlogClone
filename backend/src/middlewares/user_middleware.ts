import { Express } from "express";
import userRoutes from "../routes/user_routes.js"; // Adjust the path as needed
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
const jwt = jsonwebtoken;
const secret = process.env.SECRET || "defaultsecret";

const userMiddleware = async (req:any,res:any,next:any) => {

     const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try{
         const decoded = jwt.verify(token, secret) as JwtPayload;
          req.user = decoded; // Attach the decoded user info to the request object
        // You can also pass the user info to the next middleware or route handler
        next();
    }catch (error) {
        console.error("Error verifying token:");
        res.status(401).json({ message: "Invalid token" });
    }

}
export default userMiddleware