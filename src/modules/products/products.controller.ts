/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { diskStorage } from 'multer';
import { join } from 'path';
import type { Express } from 'express';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import {
  productImageFilename,
  productImageFileFilter,
} from '../../common/utils/file.util';

@ApiTags('Sản phẩm')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm có phân trang, tìm kiếm, lọc và sắp xếp',
  })
  @ApiOkResponse({ description: 'Lấy danh sách sản phẩm thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiQuery({
    name: 'keyword',
    required: false,
    example: 'iphone',
    description: 'Từ khóa tìm kiếm theo tên, đường dẫn hoặc mô tả sản phẩm',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    example: 'true',
    description: 'Lọc theo trạng thái hoạt động của sản phẩm',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    example: '1',
    description: 'Lọc sản phẩm theo mã danh mục',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: '1',
    description: 'Số trang hiện tại',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: '10',
    description: 'Số lượng bản ghi trên mỗi trang',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'id',
    description: 'Trường dữ liệu dùng để sắp xếp',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'DESC',
    description: 'Thứ tự sắp xếp dữ liệu',
  })
  async findAll(@Query() query: QueryProductDto) {
    const result = await this.productsService.findAll(query);

    return {
      message: 'Lấy danh sách sản phẩm thành công',
      data: result.items,
      meta: {
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm theo mã sản phẩm' })
  @ApiOkResponse({ description: 'Lấy thông tin sản phẩm thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiBadRequestResponse({ description: 'Mã sản phẩm không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);

    return {
      message: 'Lấy thông tin sản phẩm thành công',
      data: product,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public', 'uploads', 'products'),
        filename: (_req, file, cb) => {
          cb(null, productImageFilename(file.originalname));
        },
      }),
      fileFilter: productImageFileFilter,
    }),
  )
  @ApiOperation({ summary: 'Tạo sản phẩm mới, chỉ dành cho quản trị viên' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Sony WH-1000XM5',
          description: 'Tên sản phẩm',
        },
        slug: {
          type: 'string',
          example: 'sony-wh-1000xm5',
          description: 'Đường dẫn định danh của sản phẩm',
        },
        description: {
          type: 'string',
          example: 'Tai nghe chống ồn Sony',
          description: 'Mô tả ngắn về sản phẩm',
        },
        image: {
          type: 'string',
          example: 'https://example.com/image.jpg',
          description: 'Tên tệp ảnh hoặc đường dẫn ảnh của sản phẩm',
        },
        price: {
          type: 'string',
          example: '8990000',
          description: 'Giá sản phẩm',
        },
        stockQuantity: {
          type: 'integer',
          example: 12,
          description: 'Số lượng sản phẩm còn trong kho',
        },
        isActive: {
          type: 'boolean',
          example: true,
          description: 'Trạng thái hoạt động của sản phẩm',
        },
        categoryId: {
          type: 'integer',
          example: 4,
          description: 'Mã danh mục của sản phẩm',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp ảnh sản phẩm tải lên',
        },
      },
      required: ['name', 'slug', 'price', 'stockQuantity', 'categoryId'],
    },
  })
  @ApiOkResponse({ description: 'Tạo sản phẩm thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ' })
  @ApiConflictResponse({ description: 'Đường dẫn sản phẩm đã tồn tại' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục' })
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const product = await this.productsService.create(dto, file);

    return {
      message: 'Tạo sản phẩm thành công',
      data: product,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public', 'uploads', 'products'),
        filename: (_req, file, cb) => {
          cb(null, productImageFilename(file.originalname));
        },
      }),
      fileFilter: productImageFileFilter,
    }),
  )
  @ApiOperation({ summary: 'Cập nhật sản phẩm, chỉ dành cho quản trị viên' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Sony WH-1000XM5',
          description: 'Tên sản phẩm',
        },
        slug: {
          type: 'string',
          example: 'sony-wh-1000xm5',
          description: 'Đường dẫn định danh của sản phẩm',
        },
        description: {
          type: 'string',
          example: 'Tai nghe chống ồn Sony',
          description: 'Mô tả ngắn về sản phẩm',
        },
        image: {
          type: 'string',
          example: 'https://example.com/image.jpg',
          description: 'Tên tệp ảnh hoặc đường dẫn ảnh của sản phẩm',
        },
        price: {
          type: 'string',
          example: '8990000',
          description: 'Giá sản phẩm',
        },
        stockQuantity: {
          type: 'integer',
          example: 12,
          description: 'Số lượng sản phẩm còn trong kho',
        },
        isActive: {
          type: 'boolean',
          example: true,
          description: 'Trạng thái hoạt động của sản phẩm',
        },
        categoryId: {
          type: 'integer',
          example: 4,
          description: 'Mã danh mục của sản phẩm',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp ảnh sản phẩm tải lên',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Cập nhật sản phẩm thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu gửi lên không hợp lệ hoặc mã sản phẩm không hợp lệ',
  })
  @ApiConflictResponse({ description: 'Đường dẫn sản phẩm đã tồn tại' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm hoặc danh mục' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const product = await this.productsService.update(id, dto, file);

    return {
      message: 'Cập nhật sản phẩm thành công',
      data: product,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa sản phẩm, chỉ dành cho quản trị viên' })
  @ApiOkResponse({ description: 'Xóa sản phẩm thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiBadRequestResponse({ description: 'Mã sản phẩm không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);

    return {
      message: 'Xóa sản phẩm thành công',
      data: null,
    };
  }

  @Post(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Khôi phục sản phẩm, chỉ dành cho quản trị viên' })
  @ApiOkResponse({ description: 'Khôi phục sản phẩm thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm' })
  @ApiBadRequestResponse({ description: 'Mã sản phẩm không hợp lệ' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.restore(id);

    return {
      message: 'Khôi phục sản phẩm thành công',
      data: product,
    };
  }
}
