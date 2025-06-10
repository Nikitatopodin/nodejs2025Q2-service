import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBadRequestResponse({ description: 'Missing required fields' })
  async signup(@Body() createUserDto: CreateUserDto) {
    const newUserTokens = this.authService.signup(createUserDto);

    return newUserTokens;
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiForbiddenResponse({ description: 'User not found' })
  @HttpCode(200)
  async login(@Body() loginRequestDto: CreateUserDto) {
    const newUserTokens = this.authService.login(loginRequestDto);

    return newUserTokens;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Tokens refresh' })
  @ApiResponse({
    status: 200,
    description: 'Tokens were successfully refreshed',
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token is missing' })
  @ApiForbiddenResponse({ description: 'Refresh token is invalid or expired' })
  @HttpCode(200)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }
}
