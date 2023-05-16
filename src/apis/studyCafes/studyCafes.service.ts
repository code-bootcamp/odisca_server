import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyCafe } from './entities/studyCafe.entity';
import {
  IStudyCafesServiceCreate,
  IStudyCafesServiceCreateCafeFloorPlan,
  IStudyCafesServiceFetchStudyCafeById,
  IStudyCafesServiceFetchStudyCafesById,
  IStudyCafesServiceUpdate,
} from './interfaces/studyCafes-service.interfaces';

@Injectable()
export class StudyCafesService {
  constructor(
    @InjectRepository(StudyCafe)
    private readonly studyCafeRepository: Repository<StudyCafe>,
  ) {}

  // 스터디 카페 등록
  createStudyCafe({
    createStudyCafeInput,
    adminId,
  }: IStudyCafesServiceCreate): Promise<StudyCafe> {
    return this.studyCafeRepository.save({
      ...createStudyCafeInput,
      administer: { id: adminId },
    });
  }

  // 스터디 카페 좌석배치도 등록
  createCafeFloorPlan({
    createCafeFloorPlanInput,
  }: IStudyCafesServiceCreateCafeFloorPlan): Promise<StudyCafe> {
    return this.studyCafeRepository.save({
      ...createCafeFloorPlanInput,
    });
  }

  // 등록한 스터디 카페 전체 조회
  fetchStudyCafesById({
    adminId,
  }: IStudyCafesServiceFetchStudyCafesById): Promise<StudyCafe[]> {
    return this.studyCafeRepository.find({
      where: { administer: { id: adminId } },
      relations: ['administer'],
    });
  }

  // 등록한 스터디 카페 하나 조회
  fetchStudyCafeById({
    studyCafeId,
  }: IStudyCafesServiceFetchStudyCafeById): Promise<StudyCafe> {
    return this.studyCafeRepository.findOne({
      where: { id: studyCafeId },
      relations: ['administer'],
    });
  }

  // 스터디 카페 수정
  update({
    updateStudyCafeInput,
    adminId,
  }: IStudyCafesServiceUpdate): Promise<StudyCafe> {
    return this.studyCafeRepository.save({
      id: updateStudyCafeInput.studyCafeId,
      ...updateStudyCafeInput,
      administer: { id: adminId },
    });
  }
}
