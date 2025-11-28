import { connection } from "../connection";
import {
  selectPostsTemplate,
  deletePostTemplate,
  insertPostTemplate,
  selectUserByIdTemplate,
} from "./query-tamplates";
import { Post } from "./types";

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all<Post>(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });

export const deletePost = (postId: string): Promise<void> =>
  new Promise((resolve, reject) => {
    connection.run(deletePostTemplate, [postId], function (error) {
      if (error) {
        reject(error);
        return;
      }
      if (this.changes === 0) {
        reject(new Error("Post not found"));
        return;
      }
      resolve();
    });
  });

export const userExists = (userId: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    connection.get<{ id: string }>(
      selectUserByIdTemplate,
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(!!result);
      }
    );
  });

export const createPost = (
  postId: string,
  userId: string,
  title: string,
  body: string
): Promise<Post> =>
  new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();
    connection.run(
      insertPostTemplate,
      [postId, userId, title, body, createdAt],
      function (error) {
        if (error) {
          reject(error);
          return;
        }
        // Return the created post
        const newPost: Post = {
          id: postId,
          user_id: userId,
          title,
          body,
          created_at: createdAt,
        };
        resolve(newPost);
      }
    );
  });
