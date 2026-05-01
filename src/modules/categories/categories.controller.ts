import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/ecommerce.enum';

const categoryImageStorage = diskStorage({
  destination: './public/uploads/categories',
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = extname(file.originalname).toLowerCase();

    callback(null, `category-${uniqueSuffix}${fileExt}`);
  },
});

function categoryImageFilter(
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Ảnh danh mục chỉ hỗ trợ JPG, PNG hoặc WEBP'),
      false,
    );
  }

  callback(null, true);
}

const categoryImageUploadOptions = {
  storage: categoryImageStorage,
  fileFilter: categoryImageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};

@ApiTags('Admin - Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary:
      'Lấy danh sách danh mục có search, filter, trạng thái và phân trang',
  })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get('tree')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục dạng cây cha - con',
  })
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get('active')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục đang hoạt động cho form sản phẩm',
  })
  findActiveForProductForm() {
    return this.categoriesService.findActiveForProductForm();
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục theo ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID danh mục',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseInterceptors(FileInterceptor('image', categoryImageUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Tạo danh mục mới',
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoriesService.create(createCategoryDto, image);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseInterceptors(FileInterceptor('image', categoryImageUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cập nhật thông tin danh mục',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID danh mục cần cập nhật',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, image);
  }

  @Patch(':id/toggle-active')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Bật hoặc tắt trạng thái hoạt động của danh mục',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID danh mục cần đổi trạng thái',
  })
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.toggleActive(id);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Xóa mềm danh mục bằng deleted_at',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID danh mục cần xóa mềm',
  })
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Khôi phục danh mục đã bị xóa mềm',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID danh mục cần khôi phục',
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.restore(id);
  }

  @Delete(':id/force')
  @Roles(RoleName.ADMIN)
  @ApiOperation({
    summary: 'Xóa vĩnh viễn danh mục, chỉ admin được thao tác',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID danh mục cần xóa vĩnh viễn',
  })
  forceDelete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.forceDelete(id);
  }
}
