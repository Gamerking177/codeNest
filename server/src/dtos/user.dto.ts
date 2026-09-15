import { IUser } from '../models/User.js';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  college: string;
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function toUserDto(user: IUser): UserDto {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    college: user.college || '',
    avatar: user.avatar || '',
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
