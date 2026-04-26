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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@ApiTags('Danh mục')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách danh mục có phân trang, tìm kiếm, lọc và sắp xếp',
  })
  @ApiOkResponse({ description: 'Lấy danh sách danh mục thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiQuery({
    name: 'keyword',
    required: false,
    example: 'điện thoại',
    description: 'Từ khóa tìm kiếm theo tên hoặc mô tả danh mục',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    example: 'true',
    description: 'Lọc theo trạng thái hoạt động của danh mục',
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
  async findAll(@Query() query: QueryCategoryDto) {
    const result = await this.categoriesService.findAll(query);

    return {
      message: 'Lấy danh sách danh mục thành công',
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
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo mã danh mục' })
  @ApiOkResponse({ description: 'Lấy thông tin danh mục thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiBadRequestResponse({ description: 'Mã danh mục không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);

    return {
      message: 'Lấy thông tin danh mục thành công',
      data: category,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo danh mục mới, chỉ dành cho quản trị viên' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiOkResponse({ description: 'Tạo danh mục thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ' })
  @ApiConflictResponse({
    description: 'Tên danh mục hoặc đường dẫn danh mục đã tồn tại',
  })
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);

    return {
      message: 'Tạo danh mục thành công',
      data: category,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục, chỉ dành cho quản trị viên' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ description: 'Cập nhật danh mục thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu gửi lên không hợp lệ hoặc mã danh mục không hợp lệ',
  })
  @ApiConflictResponse({
    description: 'Tên danh mục hoặc đường dẫn danh mục đã tồn tại',
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(id, dto);

    return {
      message: 'Cập nhật danh mục thành công',
      data: category,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa danh mục, chỉ dành cho quản trị viên' })
  @ApiOkResponse({ description: 'Xóa danh mục thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiBadRequestResponse({ description: 'Mã danh mục không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);

    return {
      message: 'Xóa danh mục thành công',
      data: null,
    };
  }

  @Post(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Khôi phục danh mục, chỉ dành cho quản trị viên' })
  @ApiOkResponse({ description: 'Khôi phục danh mục thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục' })
  @ApiBadRequestResponse({ description: 'Mã danh mục không hợp lệ' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.restore(id);

    return {
      message: 'Khôi phục danh mục thành công',
      data: category,
    };
  }
}
