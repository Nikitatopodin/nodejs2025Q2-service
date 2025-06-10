import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from 'jsonwebtoken';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly CRYPT_SALT: number;
  private readonly JWT_SECRET_KEY: string;
  private readonly JWT_SECRET_REFRESH_KEY: string;
  private readonly TOKEN_EXPIRE_TIME: string;
  private readonly TOKEN_REFRESH_EXPIRE_TIME: string;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.CRYPT_SALT = +configService.getOrThrow('CRYPT_SALT');
    this.JWT_SECRET_KEY = configService.getOrThrow('JWT_SECRET_KEY');
    this.JWT_SECRET_REFRESH_KEY = configService.getOrThrow(
      'JWT_SECRET_REFRESH_KEY',
    );
    this.TOKEN_EXPIRE_TIME = configService.getOrThrow('TOKEN_EXPIRE_TIME');
    this.TOKEN_REFRESH_EXPIRE_TIME = configService.getOrThrow(
      'TOKEN_REFRESH_EXPIRE_TIME',
    );
  }

  private generateAccessToken(payload: { userId: string; login: string }) {
    return this.jwtService.sign(payload, {
      secret: this.JWT_SECRET_KEY,
      expiresIn: this.TOKEN_EXPIRE_TIME,
    });
  }

  private generateRefreshToken(payload: { userId: string; login: string }) {
    return this.jwtService.sign(payload, {
      secret: this.JWT_SECRET_REFRESH_KEY,
      expiresIn: this.TOKEN_REFRESH_EXPIRE_TIME,
    });
  }

  async signup(dto: CreateUserDto) {
    const newUser = this.userRepository.create({
      id: randomUUID(),
      login: dto.login,
      password: await bcrypt.hash(dto.password, this.CRYPT_SALT),
      version: 1,
      createdAt: new Date().getTime() - 1748000000000,
      updatedAt: new Date().getTime() - 1748000000000,
    });

    await this.userRepository.save(newUser);

    return {
      id: newUser.id,
      accessToken: this.generateAccessToken({
        userId: newUser.id,
        login: newUser.login,
      }),
      refreshToken: this.generateRefreshToken({
        userId: newUser.id,
        login: newUser.login,
      }),
    };
  }

  async login(dto: CreateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { login: dto.login },
      select: {
        id: true,
        password: true,
      },
    });

    if (!foundUser) throw new ForbiddenException('User not found');

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      foundUser.password,
    );

    if (!isPasswordValid) throw new ForbiddenException('User not found');

    return {
      id: foundUser.id,
      accessToken: this.generateAccessToken({
        userId: foundUser.id,
        login: foundUser.login,
      }),
      refreshToken: this.generateRefreshToken({
        userId: foundUser.id,
        login: foundUser.login,
      }),
    };
  }

  async refresh(dto: RefreshTokenDto) {
    if (!dto.refreshToken) throw new UnauthorizedException();

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        dto.refreshToken,
        {
          secret: this.JWT_SECRET_REFRESH_KEY,
        },
      );

      if (payload) {
        const foundUser = await this.userRepository.findOne({
          where: {
            id: payload.id,
          },
          select: {
            id: true,
            login: true,
          },
        });

        if (!foundUser) throw new ForbiddenException();

        return {
          id: foundUser.id,
          accessToken: this.generateAccessToken({
            userId: foundUser.id,
            login: foundUser.login,
          }),
          refreshToken: this.generateRefreshToken({
            userId: foundUser.id,
            login: foundUser.login,
          }),
        };
      }
    } catch {
      throw new ForbiddenException();
    }
  }
}
