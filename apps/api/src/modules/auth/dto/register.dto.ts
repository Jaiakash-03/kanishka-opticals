import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ravi Kumar' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'ravi@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, { message: 'Phone must be a valid Indian mobile number (+91XXXXXXXXXX)' })
  phone!: string;

  @ApiProperty({ example: 'Str0ng@Pass!' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and a number',
  })
  password!: string;
}
