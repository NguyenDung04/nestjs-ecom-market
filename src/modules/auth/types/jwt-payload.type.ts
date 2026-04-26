import { UserRole } from '../../../common/enums/role.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  username: string;
  role: UserRole;
};
