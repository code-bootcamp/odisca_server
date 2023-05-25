import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
    private readonly studyCafeRepository: Repository<StudyCafe>, //

    private readonly imageService: ImagesService, //
  ) {}

  // 스터디 카페 등록
  async createStudyCafe({
    createStudyCafeInput,
    administer_id,
  }: IStudyCafesServiceCreate): Promise<StudyCafe> {
    const { image, ...StudyCafe } = createStudyCafeInput;
    const result = await this.studyCafeRepository.save({
      ...StudyCafe,
      administer: { administer_id },
    });
    await this.imageService.createCafeImage({ image, result });
    return result;
  }

  // 스터디 카페 좌석배치도 및 좌석 수 등록
  async createCafeFloorPlanAndSeats({
    createCafeFloorPlanInput,
  }: IStudyCafesServiceCreateCafeFloorPlan): Promise<boolean> {
    const result = await this.studyCafeRepository.save({
      ...createCafeFloorPlanInput,
    });
    return result ? true : false;
  }

  // 전체 카페 조회 (in 메인 페이지)
  async fetchAllStudyCafes({ fetchAllStudyCafesInput }) {
    const { studyCafe_city, studyCafe_district, page } =
      fetchAllStudyCafesInput;
    const pageSize = 10;
    return this.studyCafeRepository.find({
      where: { studyCafe_city } && { studyCafe_district },
      relations: ['images'],
      order: { studyCafe_name: 'ASC' },
      take: pageSize,
      skip: pageSize * (page - 1),
    });
  }

  // 등록한 스터디 카페 전체 조회 (메인 이미지만 조회)
  fetchStudyCafesById({
    administer_id,
  }: IStudyCafesServiceFetchStudyCafesById): Promise<StudyCafe[]> {
    return this.studyCafeRepository.find({
      where: { administer: { administer_id }, images: { image_isMain: true } },
      relations: ['administer', 'images'],
    });
  }

  // 스터디 카페 하나 조회(유저용 - 상세페이지)
  async fetchStudyCafeByIdForUser({
    studyCafe_id,
  }: IStudyCafesServiceFetchStudyCafeById): Promise<StudyCafe> {
    const result = await this.studyCafeRepository.findOne({
      where: { studyCafe_id },
      relations: ['images', 'review', 'review.user', 'seats'],
      order: { review: { review_createdAt: 'DESC' } },
    });
    return result;
  }

  // 등록한 스터디 카페 하나 조회(관리자용)
  async fetchStudyCafeByIdForAdmin({ studyCafe_id }): Promise<StudyCafe> {
    return this.studyCafeRepository.findOne({
      where: { studyCafe_id },
      relations: ['images', 'seats'],
    });
  }

  // 스터디 카페 수정
  async updateStudyCafe({
    updateStudyCafeInput,
    administer_id,
  }: IStudyCafesServiceUpdate): Promise<boolean> {
    const { image, ...StudyCafe } = updateStudyCafeInput;
    try {
      const result = await this.studyCafeRepository.save({
        ...StudyCafe,
        administer: { administer_id },
      });
      if (image) await this.imageService.update({ image, result });
      return true;
    } catch {
      throw new UnprocessableEntityException('스터디카페 정보수정 실패!');
    }
  }
}
