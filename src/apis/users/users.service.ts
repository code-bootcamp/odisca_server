import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUsersServiceCreate } from './interfaces/users-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 회원 등록
  async create({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { name, email, password, phone } = createUserInput;

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersRepository.save({
      name,
      email,
      password: hashedPassword,
      phone,
    });
  }
}
