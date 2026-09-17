import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import { UserDto, toUserDto } from '../dtos/user.dto.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';
import { Role } from '../types/rbac.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export class AuthService {
  static generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  static async register(input: RegisterInput): Promise<AuthTokens> {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new AppError('An account with this email address already exists.', 409, 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await User.create({
      email: input.email,
      passwordHash,
      name: input.name,
      college: input.college || '',
      role: Role.USER,
    });

    const tokens = this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: toUserDto(user),
    };
  }

  static async login(input: LoginInput): Promise<AuthTokens> {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: toUserDto(user),
    };
  }

  static async refreshToken(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: UserDto }> {
    try {
      const decoded = jwt.verify(oldRefreshToken, env.REFRESH_TOKEN_SECRET) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found.', 401, 'USER_NOT_FOUND');
      }

      const { accessToken, refreshToken } = this.generateTokens(user);

      return {
        accessToken,
        refreshToken,
        user: toUserDto(user),
      };
    } catch {
      throw new AppError('Invalid or expired refresh token. Please log in again.', 401, 'INVALID_REFRESH_TOKEN');
    }
  }

  static async getProfile(userId: string): Promise<UserDto> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }
    return toUserDto(user);
  }
}
