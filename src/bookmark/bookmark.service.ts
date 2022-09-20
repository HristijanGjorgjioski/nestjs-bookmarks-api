import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkService {
  @Get()
  getBookmarks() {}

  @Get()
  getBookmarkById() {}

  @Post()
  createBookmark() {}

  @Patch()
  editBookmark() {}

  @Delete()
  deleteBookmark() {}
}
