import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import zod from 'zod';
import userMiddleware from "../middlewares/user_middleware.js";
const jwt = jsonwebtoken;
const secret = process.env.SECRET || "defaultsecret";
const z = zod;
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(6).max(100),
  id : z.number().optional()
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

type SignupData = zod.infer<typeof signupSchema>;
type SigninData = zod.infer<typeof signinSchema>;


router.post("/signup", async (req, res) => {
  const { email,name, password } = req.body;

    const parsedData = signupSchema.safeParse({ email, name, password });

    if (!parsedData.success) {
        return res.status(400).json({ errors: parsedData.error.flatten().fieldErrors });
    }
    try {
       const checkUser = await prisma.user.findUnique({
        where: { email: parsedData.data.email }
    });
} catch (error) {
    return res.status(400).json({ message: "Error checking user existence" });
}
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
    // Handle user signup logic here
    const user: SignupData = await prisma.user.create({
        data: {
            email: parsedData.data.email,
            name: parsedData.data.name,
            password: hashedPassword
        }

        
    })
    const token = await jwt.sign({ id: user.id, username: email }, secret);

     return res.json({ message: "User signed up successfully!", userId: user.id, token });
    }catch (error) {
        console.error("Error during user signup:",error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.post("/signin", async(req, res) => {
  // Handle user signin logic here
  const { email, password } = req.body;
  const parsedData = signinSchema.safeParse({ email, password });
  if (!parsedData.success) {
    return res.status(400).json({ errors: parsedData.error.flatten().fieldErrors });
  }
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  try {
 const user = await  prisma.user.findUnique({ where: { email } })
    
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      const token = await jwt.sign({ id: user.id, username: email }, secret);
    return   res.json({ message: "User signed in successfully!", token });
  } catch (error) {
    console.error("Error during user signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



export default router;
