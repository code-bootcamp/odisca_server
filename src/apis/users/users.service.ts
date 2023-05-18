import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindOneByEmail,
  IUsersServiceFindOneById,
  IUsersServiceSoftDelete,
  IUsersServiceUpdate,
} from './interfaces/users-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  // 로그인 상태 유저 조회
  findOneById({ userId }: IUsersServiceFindOneById): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  // 이메일 중복 존재 검증
  findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // 회원 등록
  async create({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { name, email, password, phone } = createUserInput;

    // 1. 존재하는 이메일인지 확인
    const prevEmail = await this.findOneByEmail({ email });
    if (prevEmail) throw new ConflictException('이미 등록된 이메일입니다.');
    // 2. 새로운 이메일이라면 회원가입
    // 비밀번호 복호화 과정
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersRepository.save({
      name,
      email,
      password: hashedPassword,
      phone,
    });
  }

  // 정보 수정
  async update({
    userId,
    updateLoginUserInput,
  }: IUsersServiceUpdate): Promise<User> {
    const { password, phone } = updateLoginUserInput;
    const user = await this.findOneById({ userId });
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersRepository.save({
      id: user.id,
      password: hashedPassword,
      phone,
    });
  }

  // 회원 정보 삭제(탈퇴)
  async softDelete({ userId }: IUsersServiceSoftDelete): Promise<boolean> {
    const result = await this.usersRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }
}
