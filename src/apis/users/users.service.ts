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
import { VisitService } from '../visit/visit.service';
import { ImagesService } from '../images/images.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly visitService: VisitService,
    private readonly imagesService: ImagesService,
  ) {}
  // 로그인 상태 유저 조회
  async findOneById({ user_id }: IUsersServiceFindOneById): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id },
      relations: [
        'visits',
        'visits.studyCafe',
        'visits.studyCafe.images',
        'seat',
      ],
      order: { visits: { visit_createdAt: 'desc' } },
    });
    return user;
  }

  // 이메일 중복 존재 검증
  findOneByEmail({ user_email }: IUsersServiceFindOneByEmail): Promise<User> {
    return this.usersRepository.findOne({ where: { user_email } });
  }

  // 회원 등록
  async create({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { user_name, user_email, user_password, user_phone } =
      createUserInput;

    // 1. 존재하는 이메일인지 확인
    const prevEmail = await this.findOneByEmail({ user_email });
    if (prevEmail) throw new ConflictException('이미 등록된 이메일입니다.');
    // 2. 새로운 이메일이라면 회원가입
    // 비밀번호 복호화 과정
    const hashedPassword = await bcrypt.hash(user_password, 10);
    return this.usersRepository.save({
      user_name,
      user_email,
      user_password: hashedPassword,
      user_phone,
    });
  }

  // 정보 수정
  async update({
    user_id,
    updateLoginUserInput,
  }: IUsersServiceUpdate): Promise<boolean> {
    const { user_password, user_phone, user_image } = updateLoginUserInput;
    const user = await this.usersRepository.findOne({ where: { user_id } });
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const result = await this.usersRepository.update(
      {
        user_id: user.user_id,
      },
      {
        user_password: hashedPassword,
        user_phone,
        user_image,
      },
    );
    return result.affected ? true : false;
  }

  // 회원 정보 삭제(탈퇴)
  async softDelete({ user_id }: IUsersServiceSoftDelete): Promise<boolean> {
    const result = await this.usersRepository.softDelete({ user_id });
    return result.affected ? true : false;
  }
}
