import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(user: User, dto: EditUserDto) {
    const newUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...dto,
      },
    });

    delete newUser.hash;

    return newUser;
  }
}
