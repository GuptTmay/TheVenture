import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class BlogModel {
  async getBlogs() {
    return await prisma.blog.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getBlog(blogId: string) {
    return await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async createBlog(title: string, content: string, authorId: string) {
    return await prisma.blog.create({
      data: {
        title,
        content,
        authorId,
      },
    });
  }

  async updateBlog(
    blogId: string,
    authorId: string,
    toUpdateData: {
      title?: string;
      content?: string;
    }
  ) {
    return await prisma.blog.update({
      where: {
        id: blogId,
        authorId: authorId,
      },
      data: toUpdateData,
    });
  }

  async deleteBlog(blogId: string, authorId: string) {
    return await prisma.blog.delete({
      where: {
        id: blogId,
        authorId: authorId,
      },
    });
  }

  async getUserBlogs(userId: string) {
    return await prisma.blog.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async checkBlog(blogId: string) {
    return await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
    });
  }
}
