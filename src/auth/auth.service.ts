import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // Sign JWT Token
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: "1h",
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token,
    };
  }

  // Login
  async login({ email, password }: AuthDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException("Credentials incorrect");

    const pwMatches = await argon.verify(user.hash, password);
    if (!pwMatches) throw new ForbiddenException("Credentials incorrect");

    return this.signToken(user.id, email);
  }

  // Signup/Register
  async signup({
    email,
    password,
  }: AuthDto): Promise<{ access_token: string }> {
    const hash = await argon.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
        },
      });
      return this.signToken(user.id, email);
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
