import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { BookmarkService } from "./bookmark.service";

@UseGuards(JwtGuard)
@Controller("bookmarks")
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser("id") userId: number) {
    return this.bookmarkService.getBookmarks();
  }

  @Get(":id")
  getBookmarkById(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById();
  }

  @Post()
  createBookmark(@GetUser("id") userId: number) {
    return this.bookmarkService.createBookmark();
  }

  @Patch()
  editBookmark(@GetUser("id") userId: number) {
    return this.bookmarkService.editBookmark();
  }

  @Delete()
  deleteBookmark(@GetUser("id") userId: number) {
    return this.bookmarkService.deleteBookmark();
  }
}
