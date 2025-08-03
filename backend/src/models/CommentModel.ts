import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export default class CommentModel {
  async getComments(blogId: string) {
    return await prisma.comment.findMany({
      where: {
        blogId: blogId,
      },
      select: {
        content: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createComment(blogId: string, userId: string, content: string) {
    return await prisma.comment.create({
      data: {
        userId: userId,
        blogId: blogId,
        content: content,
      },
    });
  }
}
