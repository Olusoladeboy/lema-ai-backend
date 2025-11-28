import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import Joi from "joi";
import {
  getPosts,
  deletePost,
  createPost,
  userExists,
} from "../db/posts/posts";

const router = Router();

// Validation schema for creating a post
const createPostSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  body: Joi.string().trim().min(1).required(),
  userId: Joi.string().trim().min(1).required(),
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId?.toString();
    if (!userId) {
      res.status(400).send({ error: "userId is required" });
      return;
    }

    // Validate userId exists
    const userExistsCheck = await userExists(userId);
    if (!userExistsCheck) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const posts = await getPosts(userId);
    res.send(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    // Validate input using Joi
    const { error, value } = createPostSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      res.status(400).send({ error: errorMessage });
      return;
    }

    const { title, body, userId } = value;

    // Validate userId exists
    const user = await userExists(userId);
    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const postId = randomUUID().replace(/-/g, "").substring(0, 32);

    // Create the post (Joi already trimmed the values)
    const newPost = await createPost(postId, userId, title, body);
    res.status(201).send(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      res.status(400).send({ error: "Post ID is required" });
      return;
    }

    await deletePost(postId);

    res.status(200).send({ message: "Post deleted successfully" });

  } catch (error: any) {
    console.error("Error deleting post:", error);
    if (error.message === "Post not found") {
      res.status(404).send({ error: "Post not found" });
    } else {
      res.status(500).send({ error: "Internal server error" });
    }
  }
});

export default router;
