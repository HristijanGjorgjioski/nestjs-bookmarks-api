import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login(dto: any) {
    console.log(dto);
  }

  signup() {
    return "Signup";
  }
}
