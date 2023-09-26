import { Injectable, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExits = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserExits) {
      throw new BadRequestException('This email already exist!');
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });

    return { user };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
