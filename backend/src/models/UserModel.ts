import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class UserModel {

  async createUser(email: string, hashpass: string) {
    return await prisma.user.create({
      data: {
        email: email,
        password: hashpass
      },
      select: {
        id: true
      }
    })
  }

  async checkUser(email: string) {
    const data = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    return data;
  }
}