import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Login
  async login({ email, password }: AuthDto): Promise<{
    user: User;
    message: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException("Credentials incorrect");

    const pwMatches = await argon.verify(user.hash, password);
    if (!pwMatches) throw new ForbiddenException("Credentials incorrect");

    return { user, message: "Successfully logged in" };
  }

  // Signup/Register
  async signup({
    email,
    password,
  }: AuthDto): Promise<{ user: User; message: string }> {
    const hash = await argon.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
        },
      });
      return { user, message: "Successfully registered" };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials taken");
        }
      }
      throw error;
    }
  }
}
