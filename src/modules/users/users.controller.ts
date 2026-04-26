/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Delete,
  Post,
  Get,
  Param,
  Patch,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('Người dùng')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Lấy thông tin hồ sơ của người dùng đang đăng nhập',
  })
  @ApiOkResponse({ description: 'Lấy thông tin hồ sơ thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  async me(@Req() req: any) {
    const user = await this.usersService.findOne(req.user.id);

    return {
      message: 'Lấy thông tin hồ sơ thành công',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Cập nhật hồ sơ của người dùng đang đăng nhập' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ description: 'Cập nhật hồ sơ thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ' })
  @ApiConflictResponse({ description: 'Email hoặc tên đăng nhập đã tồn tại' })
  async updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, dto);

    return {
      message: 'Cập nhật hồ sơ thành công',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách người dùng, chỉ dành cho quản trị viên',
  })
  @ApiOkResponse({ description: 'Lấy danh sách người dùng thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    example: 'admin',
    description: 'Từ khóa tìm kiếm theo email hoặc tên đăng nhập',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    example: 'true',
    description: 'Lọc theo trạng thái hoạt động của tài khoản',
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
  async findAll(@Query() query: QueryUserDto) {
    const result = await this.usersService.findAll(query);

    return {
      message: 'Lấy danh sách người dùng thành công',
      data: result.items.map((user) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
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
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Lấy thông tin người dùng theo mã người dùng, chỉ dành cho quản trị viên',
  })
  @ApiOkResponse({ description: 'Lấy thông tin người dùng thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiBadRequestResponse({ description: 'Mã người dùng không hợp lệ' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    return {
      message: 'Lấy thông tin người dùng thành công',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật người dùng, chỉ dành cho quản trị viên' })
  @ApiBody({ type: AdminUpdateUserDto })
  @ApiOkResponse({ description: 'Cập nhật người dùng thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu gửi lên không hợp lệ hoặc mã người dùng không hợp lệ',
  })
  @ApiConflictResponse({ description: 'Email hoặc tên đăng nhập đã tồn tại' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateUserDto,
    @Req() req: any,
  ) {
    const user = await this.usersService.adminUpdate(id, dto, req.user.id);

    return {
      message: 'Cập nhật người dùng thành công',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa người dùng, chỉ dành cho quản trị viên' })
  @ApiOkResponse({ description: 'Xóa người dùng thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiBadRequestResponse({ description: 'Mã người dùng không hợp lệ' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.usersService.remove(id, req.user.id);

    return {
      message: 'Xóa người dùng thành công',
      data: null,
    };
  }

  @Post(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Khôi phục người dùng, chỉ dành cho quản trị viên' })
  @ApiOkResponse({ description: 'Khôi phục người dùng thành công' })
  @ApiUnauthorizedResponse({ description: 'Vui lòng đăng nhập để tiếp tục' })
  @ApiForbiddenResponse({
    description: 'Bạn không có quyền thực hiện thao tác này',
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiBadRequestResponse({ description: 'Mã người dùng không hợp lệ' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.restore(id);

    return {
      message: 'Khôi phục người dùng thành công',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    };
  }
}
