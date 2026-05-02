import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductStatus } from 'src/common/enums/ecommerce.enum';

export class UpdateProductStatusDto {
  @ApiProperty({
    example: ProductStatus.ACTIVE,
    description: 'Trạng thái mới của sản phẩm',
    enum: ProductStatus,
  })
  @IsNotEmpty({ message: 'Trạng thái sản phẩm không được để trống' })
  @IsEnum(ProductStatus, {
    message: 'Trạng thái sản phẩm không hợp lệ',
  })
  status!: ProductStatus;
}
