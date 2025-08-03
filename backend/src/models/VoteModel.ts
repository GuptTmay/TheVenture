import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class VoteModel {
  async countVotes(blogId: string) {
    return await prisma.vote.count({
      where: {
        blogId: blogId,
      },
    });
  }

  async addVote(userId: string, blogId: string) {
    return await prisma.vote.create({
      data: {
        userId: userId,
        blogId: blogId,
      },
    });
  }

  async removeVote(userId: string, blogId: string) {
    return await prisma.vote.deleteMany({
      where: {
        userId: userId,
        blogId: blogId,
      },
    });
  }

  async checkIfVoted(userId: string, blogId: string) {
    const vote = await prisma.vote.findFirst({
      where: {
        userId: userId,
        blogId: blogId,
      },
    });
    return vote !== null;
  }
}
