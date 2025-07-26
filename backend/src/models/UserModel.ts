import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export default class UserModel {
  async createUser(name: string, email: string, hashpass: string) {
    return await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashpass,
      },
      select: {
        id: true,
      },
    });
  }

  async checkUser(email: string) {
    const data = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return data;
  }

  async updateUser(
    email: string,
    data: Partial<Pick<User, "name" | "password">>
  ) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return await prisma.user.update({
      where: {
        email: email,
      },
      data: data,
    });
  }
}
