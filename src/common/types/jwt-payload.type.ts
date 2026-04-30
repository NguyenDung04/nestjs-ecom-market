import { RoleName } from 'src/common/enums/ecommerce.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  role: RoleName | string;
};
