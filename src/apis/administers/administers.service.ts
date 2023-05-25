import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administer } from './entities/administer.entity';
import * as bcrypt from 'bcrypt';
import {
  IAdministerServiceUpdate,
  IAdministersServiceCreate,
  IAdministersServiceFindAdminWithStudyCafes,
  IAdministersServiceFindOneByEmail,
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
    administer_id,
  }: IAdministersServiceFindOneById): Promise<Administer> {
    return this.administersRepository.findOne({
      where: { administer_id },
    });
  }

  // 이메일로 조회
  findOneByEmail({
    administer_email,
  }: IAdministersServiceFindOneByEmail): Promise<Administer> {
    return this.administersRepository.findOne({ where: { administer_email } });
  }

  // 회원가입
  async create({
    createAdministerInput,
  }: IAdministersServiceCreate): Promise<Administer> {
    const {
      administer_password,
      administer_email,
      administer_name,
      administer_phone,
    } = createAdministerInput;

    // 1. 존재하는 이메일인지 확인
    const prevEmail = await this.findOneByEmail({ administer_email });
    if (prevEmail) throw new ConflictException('이미 등록된 이메일입니다.');
    // 2. 새로운 이메일이라면 회원가입
    // 비밀번호 복호화 과정
    const hashedPassword = await bcrypt.hash(administer_password, 10);
    return this.administersRepository.save({
      administer_name,
      administer_password: hashedPassword,
      administer_email,
      administer_phone,
    });
  }

  // 관리자 id로 관리자 정보 찾기
  findAdminWithStudyCafes({
    administer_id, //
  }: IAdministersServiceFindAdminWithStudyCafes): Promise<Administer> {
    return this.administersRepository.findOne({
      where: { administer_id },
      relations: ['studyCafes', 'studyCafes.images'],
    });
  }

  // 정보 수정
  async update({
    administer_id,
    updateLoginAdministerInput,
  }: IAdministerServiceUpdate): Promise<Administer> {
    const { administer_password, administer_phone } =
      updateLoginAdministerInput;
    const user = await this.findOneById({ administer_id });
    const hashedPassword = await bcrypt.hash(administer_password, 10);
    return this.administersRepository.save({
      administer_id: user.administer_id,
      administer_password: hashedPassword,
      administer_phone,
    });
  }

  // 회원 정보 삭제(탈퇴)
  async softDelete({
    administer_id,
  }: IAdministersServiceSoftDelete): Promise<boolean> {
    const result = await this.administersRepository.softDelete({
      administer_id,
    });
    return result.affected ? true : false;
  }
}
