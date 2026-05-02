import {
  BadRequestException,
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/ecommerce.enum';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

const productThumbnailStorage = diskStorage({
  destination: './public/uploads/products',
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = extname(file.originalname).toLowerCase();

    callback(null, `product-${uniqueSuffix}${fileExt}`);
  },
});

function productThumbnailFilter(
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Ảnh sản phẩm chỉ hỗ trợ JPG, PNG hoặc WEBP'),
      false,
    );
  }

  callback(null, true);
}

const productThumbnailUploadOptions = {
  storage: productThumbnailStorage,
  fileFilter: productThumbnailFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};

@ApiTags('Products API')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary:
      'Lấy danh sách sản phẩm có search, filter, trạng thái và phân trang',
  })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('active')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm đang hoạt động',
  })
  findActive() {
    return this.productsService.findActive();
  }

  @Get('slug/:slug')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Lấy chi tiết sản phẩm theo slug',
  })
  @ApiParam({
    name: 'slug',
    example: 'iphone-15-128gb',
    description: 'Slug sản phẩm',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Lấy chi tiết sản phẩm theo ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID sản phẩm',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseInterceptors(FileInterceptor('thumbnail', productThumbnailUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Tạo sản phẩm mới',
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, thumbnail);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseInterceptors(FileInterceptor('thumbnail', productThumbnailUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cập nhật thông tin sản phẩm',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID sản phẩm cần cập nhật',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, thumbnail);
  }

  @Patch(':id/status')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Cập nhật trạng thái sản phẩm',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID sản phẩm cần cập nhật trạng thái',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductStatusDto: UpdateProductStatusDto,
  ) {
    return this.productsService.updateStatus(id, updateProductStatusDto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Xóa mềm sản phẩm bằng deleted_at',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID sản phẩm cần xóa mềm',
  })
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Khôi phục sản phẩm đã bị xóa mềm',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID sản phẩm cần khôi phục',
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.restore(id);
  }

  @Delete(':id/force')
  @Roles(RoleName.ADMIN)
  @ApiOperation({
    summary: 'Xóa vĩnh viễn sản phẩm, chỉ admin được thao tác',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID sản phẩm cần xóa vĩnh viễn',
  })
  forceDelete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.forceDelete(id);
  }
}
