import { Injectable } from "@nestjs/common";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: { id: userId },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findMany({
      where: { id: userId },
    });
  }

  createBookmark(userId: number, dto: CreateBookmarkDto) {}

  editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {}

  deleteBookmark(userId: number, bookarkId: number) {}
}
