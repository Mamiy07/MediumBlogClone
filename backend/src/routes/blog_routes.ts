import { Router, Request } from "express";
import userMiddleware from "../middlewares/user_middleware.js";
import { PrismaClient } from '@prisma/client';
import zod from 'zod';
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
const router = Router();

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { username?: string , id?: number };
    }
  }
}

const blogUpdateSchema = zod.object({
  id: zod.number(),
  title: zod.string().min(1).max(255),
  content: zod.string().max(5000)
});

type BlogUpdateData = zod.infer<typeof blogUpdateSchema>;

const blogSchema = zod.object({
  title: zod.string().min(1).max(255),
  content: zod.string().max(5000) 
});

type BlogData = {
  id: number;
  title: string;
  content: string | null;
  authorId?: number; // Optional, if the author is not required
}

router.get('/bulk', async (req, res) => {
  // Handle fetching multiple blogs logic here

  try{
     const allblogs = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.json({ message: "Blogs fetched successfully!", blogs: allblogs });
  }catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Internal server error" });
  } 
 
});

router.use(userMiddleware)

router.post('/', async(req, res) => {
  // Handle blog creation logic here
  const user = req.user?.id // Assuming user info is attached by middleware
  const { title, content } = req.body;
  const parsedData = blogSchema.safeParse({ title, content });
  if (!parsedData.success) {
    return res.status(400).json({ errors: parsedData.error.flatten().fieldErrors });
  }
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

   try{
      const blog: BlogData = await prisma.post.create({
    data: {
      title,
      content,
       authorId: user // Assuming user ID is available in the request
    }     
  })
   
  return res.json({ message: "Blog created successfully!", blogId: blog.id });  

   }catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Internal server error" });
  } 

});

router.put('/', async(req, res) => {
  // Handle blog update logic here
 
  const { id, title, content } = req.body;
  if (!id || !title || !content) {
    return res.status(400).json({ message: "ID, title, and content are required" });
  }

  const parsedData = blogUpdateSchema.safeParse({ id, title, content });
  if (!parsedData.success) {
    return res.status(400).json({ errors: parsedData.error.flatten().fieldErrors });
  }
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
const findUserId = await prisma.post.findUnique({
  where: { id: parsedData.data.id },
});

if (!findUserId) {
  return res.status(404).json({ message: "Blog not found" });
} 

if (findUserId.authorId !== req.user.id) {
  return res.status(403).json({ message: "Forbidden: You can only update your own blog" });
}

  try {
    const blog = await prisma.post.update({
      where: { id },
      data: { title, content }
    });
    return res.json({ message: "Blog updated successfully!", blogId: blog.id });
  } catch (error) {
    console.log("Error during blog update:");
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/:id', async(req, res) => {
  // Handle fetching a blog by ID logic here
  const blogId = req.params.id;
 
  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required" });
  }
  if (isNaN(Number(blogId))) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }
 
  const findId = await prisma.post.findUnique({
    where: { id: Number(blogId) },})
  
  if (!findId) {
    return res.status(404).json({ message: "Blog not found" });

  }
  
  try {
     const blog = await prisma.post.findUnique({
    where: { id: Number(blogId) },
    include: {
      author: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

 res.json({ message: "Blog fetched successfully!", blog });
  }catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
 
});



export default router;