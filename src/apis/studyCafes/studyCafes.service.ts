import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { visit } from 'graphql';
import { Repository } from 'typeorm';
import { ImagesService } from '../images/images.service';
import { ReviewsService } from '../reviews/reviews.service';
import { VisitService } from '../visit/visit.service';
import { FetchOneStudyCafe } from './dto/fetch-one-studyCafe.object';
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
    private readonly visitService: VisitService,
    private readonly reviewsService: ReviewsService,
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
    const result = await this.studyCafeRepository
      .createQueryBuilder('studyCafe')
      .innerJoin('studyCafe.images', 'image')
      .select('*')
      .where('studyCafe.studyCafe_city = :studyCafe_city', { studyCafe_city })
      .andWhere('studyCafe.studyCafe_district = :studyCafe_district', {
        studyCafe_district,
      })
      .andWhere('image.image_isMain = :image_isMain', { image_isMain: 1 })
      .orderBy('studyCafe.studyCafe_name', 'ASC')
      .limit(pageSize)
      .offset(pageSize * (page - 1))
      .getRawMany();
    return result;
  }

  // 등록한 스터디 카페 전체 조회
  fetchStudyCafesById({
    administer_id,
  }: IStudyCafesServiceFetchStudyCafesById): Promise<StudyCafe[]> {
    return this.studyCafeRepository.find({
      where: { administer: { administer_id } },
      relations: ['administer'],
    });
  }

  // 등록한 스터디 카페 하나 조회
  async fetchStudyCafeById(
    { studyCafe_id }: IStudyCafesServiceFetchStudyCafeById, // : Promise<StudyCafe>
  ): Promise<StudyCafe> {
    const result = await this.studyCafeRepository.findOne({
      where: { studyCafe_id },
      relations: ['images', 'review'],
      order: { review: { review_createdAt: 'DESC' } },
    });
    return result;
  }

  // 스터디 카페 수정
  async updateStudyCafe({
    updateStudyCafeInput,
    administer_id,
  }: IStudyCafesServiceUpdate): Promise<StudyCafe> {
    const { image, ...StudyCafe } = updateStudyCafeInput;
    const result = await this.studyCafeRepository.save({
      ...StudyCafe,
      administer: { administer_id },
    });
    await this.imageService.update({ image, result });
    return result;
  }
}
