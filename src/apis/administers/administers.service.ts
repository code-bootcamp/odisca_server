import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administer } from './entities/administer.entity';
import * as bcrypt from 'bcrypt';
import {
  IAdministerServiceUpdate,
  IAdministersServiceCreate,
  IAdministersServiceFindOne,
  IAdministersServiceFindOneById,
  IAdministersServiceSoftDelete,
} from './interfaces/administers-service.interface';

@Injectable()
export class AdministersService {
  constructor(
    @InjectRepository(Administer)
    private readonly administersRepository: Repository<Administer>,
  ) {}

  // 로그인 상태 유저 조회
  findOneById({
    adminId,
  }: IAdministersServiceFindOneById): Promise<Administer> {
    return this.administersRepository.findOne({
      where: { id: adminId },
    });
  }

  // 이메일로 조회
  findOneByEmail({ email }: IAdministersServiceFindOne): Promise<Administer> {
    return this.administersRepository.findOne({ where: { email } });
  }

  // 회원가입
  async create({
    createAdministerInput,
  }: IAdministersServiceCreate): Promise<Administer> {
    const { password, email, name, phone } = createAdministerInput;

    // 1. 존재하는 이메일인지 확인
    const prevEmail = await this.findOneByEmail({ email });
    if (prevEmail) throw new ConflictException('이미 등록된 이메일입니다.');
    // 2. 새로운 이메일이라면 회원가입
    // 비밀번호 복호화 과정
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.administersRepository.save({
      name,
      password: hashedPassword,
      email,
      phone,
    });
  }

  // 정보 수정
  async update({
    adminId,
    updateLoginAdministerInput,
  }: IAdministerServiceUpdate): Promise<Administer> {
    const { password, phone } = updateLoginAdministerInput;
    const user = await this.findOneById({ adminId });
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.administersRepository.save({
      id: user.id,
      password: hashedPassword,
      phone,
    });
  }

  // 회원 정보 삭제(탈퇴)
  async softDelete({
    adminId,
  }: IAdministersServiceSoftDelete): Promise<boolean> {
    const result = await this.administersRepository.softDelete({ id: adminId });
    return result.affected ? true : false;
  }
}
