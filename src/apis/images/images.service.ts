import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { IImagesServiceCreate } from './interfaces/images-service.interface';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>, //
  ) {}

  // 스터디 카페 ID 별로 이미지 조회
  async findImagesByStudyCafeIds({ studyCafe_id }) {
    return this.imagesRepository.find({
      where: { studyCafe: { studyCafe_id } },
    });
  }

  // 해당 카페 전체 이미지 조회
  findByStudyCafe({ result }) {
    return this.imagesRepository.find({ where: { studyCafe: result } });
  }

  // 선택한 카페 메인 이미지 조회
  async findOneByStudyCafe({ studyCafe_id }) {
    const result = await this.imagesRepository
      .createQueryBuilder('image')
      .innerJoinAndSelect('image.studyCafe', 'studyCafe')
      .where('image.studyCafeId = :studyCafeId', { studyCafe_id })
      .andWhere('image.image_isMain = :image_isMain', { image_isMain: true })
      .getOne();
    return result;
  }

  // 마이페이지 이미지 조회
  async findImageForMyPage({ studyCafe_id }) {
    return this.imagesRepository.findOne({
      where: { studyCafe: { studyCafeId: studyCafe_id } } && {
        image_isMain: true,
      },
    });
  }

  // 카페 이미지 저장
  async createCafeImage({ image, result }: IImagesServiceCreate) {
    const urls = [];
    const isMain = [];
    image.forEach((el) => {
      urls.push(el.image_url);
      isMain.push(el.image_isMain);
    });

    for (let i = 0; i < urls.length; i++) {
      await this.imagesRepository.save({
        image_url: urls[i],
        image_isMain: isMain[i],
        studyCafe: { studyCafe_id: result.studyCafe_id },
      });
    }
    return;
  }

  // 카페 이미지 업데이트
  async update({ image, result }) {
    const images = await this.findByStudyCafe({ result });
    for (let i = 0; i < images.length; i++) {
      this.imagesRepository.delete({
        image_id: images[i].image_id,
      });
    }
    return this.createCafeImage({ image, result });
  }
}
