import { Router } from "express";
import userRoutes from "./user_routes.js"; // Adjust the path as needed
import blogRoutes from "./blog_routes.js";
const router = Router();

router.use('/user', userRoutes);
router.use('/blog', blogRoutes);

export default router;  