import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { StudyCafesWithImages } from './dto/fetch-all-studyCafes.object';
import { StudyCafe } from './entities/studyCafe.entity';
import {
  IStudyCafesServiceCreate,
  IStudyCafesServiceCreateCafeFloorPlan,
  IStudyCafesServiceFetchAllStudyCafes,
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
    administer_id,
  }: IStudyCafesServiceCreate): Promise<StudyCafe> {
    console.log('!!!', administer_id);
    const { image, ...StudyCafe } = createStudyCafeInput;
    const result = await this.studyCafeRepository.save({
      ...StudyCafe,
      administer: { administer_id },
    });
    await this.imageService.createCafeImage({ image, result });
    return result;
  }

  // 스터디 카페 좌석배치도 및 좌석 수 등록
  createCafeFloorPlanAndSeats({
    createCafeFloorPlanInput,
  }: IStudyCafesServiceCreateCafeFloorPlan): Promise<StudyCafe> {
    return this.studyCafeRepository.save({
      ...createCafeFloorPlanInput,
    });
  }

  async fetchAllStudyCafes({ fetchAllStudyCafesInput }) {
    const { city, district } = fetchAllStudyCafesInput;
    const result = await this.studyCafeRepository
      .createQueryBuilder('studyCafe')
      .innerJoinAndSelect('studyCafe.images', 'image')
      // .addSelect('image.url')
      .select('*')
      .where('studyCafe.city = :city', { city })
      .andWhere('studyCafe.district = :district', { district })
      .getRawMany();
    console.log(result);
    return result;
  }
  // // 전체 카페 조회 (in 메인 페이지) // 이미지 query builder로 추가하기
  // async fetchAllStudyCafes({
  //   fetchAllStudyCafesInput,
  // }: IStudyCafesServiceFetchAllStudyCafes): Promise<StudyCafe[]> {
  //   const { city, district } = fetchAllStudyCafesInput;
  //   const studyCafes = await this.studyCafeRepository.find({
  //     where: { city } && { district },
  //   });
  //   console.log(studyCafes);
  //   const images = [];
  //   for (let i = 0; i < studyCafes.length; i++) {
  //     const result = studyCafes[i];
  //     images.push(await this.imageService.findImagesByStudyCafeIds({ result }));
  //   }
  //   return studyCafes;
  // }

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
  fetchStudyCafeById({
    studyCafe_id,
  }: IStudyCafesServiceFetchStudyCafeById): Promise<StudyCafe> {
    return this.studyCafeRepository.findOne({
      where: { studyCafe_id },
      relations: ['administer'],
    });
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
