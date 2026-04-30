import { User } from '../../users/entities/user.entity';

export function toRegisterResponse(user: User) {
  return {
    email: user.email,
    name: user.name,
  };
}

export function toLoginResponse(user: User) {
  return {
    email: user.email,
    name: user.name,
    role: {
      name: user.role?.name ?? null,
    },
  };
}

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    avatar: user.avatar,
    provider: user.provider,
    providerId: user.providerId,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt,
    role: user.role
      ? {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
