/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserRole } from '../../common/enums/role.enum';
import { normalizeEmail } from '../../common/utils/string.util';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import {
  sanitizeBoolean,
  sanitizeKeyword,
  sanitizePositiveInt,
  sanitizeSortField,
  sanitizeSortOrder,
} from '../../common/utils/query.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto) {
    const keyword = sanitizeKeyword(query.keyword);
    const isActive = sanitizeBoolean(query.isActive);
    const page = sanitizePositiveInt(query.page, 1, 1, 100000);
    const limit = sanitizePositiveInt(query.limit, 10, 1, 100);
    const sortBy = sanitizeSortField(
      query.sortBy,
      ['id', 'email', 'username', 'createdAt'] as const,
      'id',
    );
    const sortOrder = sanitizeSortOrder(query.sortOrder);

    const qb = this.userRepository.createQueryBuilder('user');

    if (keyword) {
      qb.andWhere('(user.email LIKE :keyword OR user.username LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    if (typeof isActive === 'boolean') {
      qb.andWhere('user.isActive = :isActive', { isActive });
    }

    const sortFieldMap = {
      id: 'user.id',
      email: 'user.email',
      username: 'user.username',
      createdAt: 'user.createdAt',
    } as const;

    qb.orderBy(sortFieldMap[sortBy], sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: normalizeEmail(email) },
    });
  }

  async createUser(params: {
    dto: RegisterDto;
    passwordHash: string;
  }): Promise<User> {
    const { dto, passwordHash } = params;

    const normalizedEmail = normalizeEmail(dto.email);
    const normalizedUsername = dto.username.trim();

    const existingEmail = await this.findByEmail(normalizedEmail);
    if (existingEmail) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const existingUsername = await this.userRepository.findOne({
      where: { username: normalizedUsername },
    });

    if (existingUsername) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    const user = this.userRepository.create({
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
      role: UserRole.USER,
      isActive: true,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    });

    return this.userRepository.save(user);
  }

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email) {
      const normalizedEmail = normalizeEmail(dto.email);

      if (normalizedEmail !== user.email) {
        const existingEmail = await this.findByEmail(normalizedEmail);
        if (existingEmail) {
          throw new ConflictException('Email đã được sử dụng');
        }
        user.email = normalizedEmail;
      }
    }

    if (dto.username) {
      const normalizedUsername = dto.username.trim();

      if (normalizedUsername !== user.username) {
        const existingUsername = await this.userRepository.findOne({
          where: { username: normalizedUsername },
        });
        if (existingUsername) {
          throw new ConflictException('Tên đăng nhập đã tồn tại');
        }
        user.username = normalizedUsername;
      }
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepository.save(user);
  }

  async adminUpdate(
    id: number,
    dto: AdminUpdateUserDto,
    currentUserId?: number,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email) {
      const normalizedEmail = normalizeEmail(dto.email);

      if (normalizedEmail !== user.email) {
        const existingEmail = await this.findByEmail(normalizedEmail);
        if (existingEmail) {
          throw new ConflictException('Email đã được sử dụng');
        }
        user.email = normalizedEmail;
      }
    }

    if (dto.username) {
      const normalizedUsername = dto.username.trim();

      if (normalizedUsername !== user.username) {
        const existingUsername = await this.userRepository.findOne({
          where: { username: normalizedUsername },
        });
        if (existingUsername) {
          throw new ConflictException('Tên đăng nhập đã tồn tại');
        }
        user.username = normalizedUsername;
      }
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role) {
      user.role = dto.role;
    }

    if (typeof dto.isActive === 'boolean') {
      if (
        currentUserId &&
        user.id === currentUserId &&
        dto.isActive === false
      ) {
        throw new ForbiddenException(
          'Bạn không thể tự vô hiệu hóa tài khoản của mình',
        );
      }

      user.isActive = dto.isActive;
    }

    return this.userRepository.save(user);
  }

  async remove(id: number, currentUserId?: number): Promise<void> {
    const user = await this.findOne(id);

    if (currentUserId && user.id === currentUserId) {
      throw new ForbiddenException('Bạn không thể tự xóa tài khoản của mình');
    }

    await this.userRepository.softRemove(user);
  }

  async restore(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (!user.deletedAt) {
      return user;
    }

    await this.userRepository.restore(id);

    return this.findOne(id);
  }

  async saveResetPasswordToken(params: {
    email: string;
    token: string;
    expiresAt: Date;
  }): Promise<void> {
    const user = await this.findByEmail(params.email);

    if (!user) {
      return;
    }

    user.resetPasswordToken = params.token;
    user.resetPasswordExpiresAt = params.expiresAt;
    await this.userRepository.save(user);
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async updatePassword(params: {
    userId: number;
    passwordHash: string;
  }): Promise<void> {
    const user = await this.findOne(params.userId);

    user.passwordHash = params.passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;

    await this.userRepository.save(user);
  }
}
