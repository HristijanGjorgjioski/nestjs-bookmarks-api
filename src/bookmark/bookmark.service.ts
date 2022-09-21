import { Injectable, ForbiddenException } from "@nestjs/common";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: { userId },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findFirst({
      where: { userId, id: bookmarkId },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    return await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.id === userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        userId,
        ...dto,
      },
    });
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.id === userId) {
      throw new ForbiddenException("Access denied");
    }

    return await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
