import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Vai trò của người dùng trong hệ thống',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò người dùng không hợp lệ' })
  role?: UserRole;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của tài khoản',
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là đúng hoặc sai' })
  isActive?: boolean;
}
