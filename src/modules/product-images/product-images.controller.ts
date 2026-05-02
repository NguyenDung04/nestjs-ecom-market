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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/common/enums/ecommerce.enum';

import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { SortProductImagesDto } from './dto/sort-product-images.dto';

const productImageStorage = diskStorage({
  destination: './public/uploads/products/gallery',
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = extname(file.originalname).toLowerCase();

    callback(null, `product-gallery-${uniqueSuffix}${fileExt}`);
  },
});

function productImageFilter(
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

const productImageUploadOptions = {
  storage: productImageStorage,
  fileFilter: productImageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};

@ApiTags('Product Images API')
@Controller('products/:productId/images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách ảnh phụ của sản phẩm',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description: 'ID sản phẩm',
  })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productImagesService.findByProduct(productId);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseInterceptors(FileInterceptor('image', productImageUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Thêm một ảnh phụ cho sản phẩm',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description: 'ID sản phẩm',
  })
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createProductImageDto: CreateProductImageDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productImagesService.create(
      productId,
      createProductImageDto,
      image,
    );
  }

  @Post('bulk')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @UseInterceptors(FilesInterceptor('images', 20, productImageUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Thêm nhiều ảnh phụ cho sản phẩm',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description: 'ID sản phẩm',
  })
  createBulk(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createProductImageDto: CreateProductImageDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.productImagesService.createBulk(
      productId,
      createProductImageDto,
      images || [],
    );
  }

  @Patch('sort')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Sắp xếp lại ảnh phụ của sản phẩm',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description: 'ID sản phẩm',
  })
  sort(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() sortProductImagesDto: SortProductImagesDto,
  ) {
    return this.productImagesService.sort(productId, sortProductImagesDto);
  }

  @Patch(':imageId')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Cập nhật ảnh phụ của sản phẩm',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description: 'ID sản phẩm',
  })
  @ApiParam({
    name: 'imageId',
    example: 1,
    description: 'ID ảnh sản phẩm',
  })
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImagesService.update(
      productId,
      imageId,
      updateProductImageDto,
    );
  }

  @Delete(':imageId')
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Xóa một ảnh phụ của sản phẩm',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description: 'ID sản phẩm',
  })
  @ApiParam({
    name: 'imageId',
    example: 1,
    description: 'ID ảnh sản phẩm',
  })
  remove(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productImagesService.remove(productId, imageId);
  }

  @Delete()
  @Roles(RoleName.ADMIN, RoleName.STAFF)
  @ApiOperation({
    summary: 'Xóa toàn bộ ảnh phụ của sản phẩm',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description: 'ID sản phẩm',
  })
  removeAllByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productImagesService.removeAllByProduct(productId);
  }
}
