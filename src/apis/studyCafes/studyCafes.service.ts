import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagesService } from '../images/images.service';
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
    private readonly imageService: ImagesService,
  ) {}

  // 스터디 카페 등록
  async createStudyCafe({
    createStudyCafeInput,
    adminId,
  }: IStudyCafesServiceCreate): Promise<StudyCafe> {
    const { image, ...StudyCafe } = createStudyCafeInput;
    const result = await this.studyCafeRepository.save({
      ...StudyCafe,
      administer: { id: adminId },
    });
    await this.imageService.createCafeImage({ image, result });
    return result;
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
  async updateStudyCafe({
    updateStudyCafeInput,
    adminId,
  }: IStudyCafesServiceUpdate): Promise<StudyCafe> {
    const { image, ...StudyCafe } = updateStudyCafeInput;
    const result = await this.studyCafeRepository.save({
      ...StudyCafe,
      administer: { id: adminId },
    });
    await this.imageService.update({ image, result });
    return result;
  }

  // 좌석 수 등록
  updateStudyCafeSeats({ studyCafeId, seatCount }) {
    return this.studyCafeRepository.update({ id: studyCafeId }, { seatCount });
  }
}
