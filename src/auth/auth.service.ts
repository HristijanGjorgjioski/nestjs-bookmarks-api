import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login({ email, password }: AuthDto): Promise<User> {
    const hash = await argon.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    delete user.hash;
    return user;
  }

  signup() {
    return "Signup";
  }
}
