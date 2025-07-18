import { PrismaClient, User } from '@prisma/client';

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

  async updateUser(email: string, data: Partial<Pick<User, "firstname" | "lastname" | "password">>) {
    await prisma.user.update({
      where: {
        email: email 
      },
      data: data
    })
  }
}