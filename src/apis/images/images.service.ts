import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { IImagesServiceCreate } from './interfaces/images-service.interface';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  // 스터디 카페 ID 별로 이미지 조회
  findImagesByStudyCafeIds({ result }) {
    return this.imagesRepository.find({ where: { studyCafe: result } });
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
      .getOne();
    // query builder 실험을 위해 잠시 주석
    // return this.imagesRepository.findOne({
    //   where: { studyCafe: { id: studyCafeId } } && { isMain: true },
    // });
    return result;
  }

  // 이미지 저장
  async createCafeImage({ image, result }: IImagesServiceCreate) {
    const urls = [];
    const isMain = [];
    image.forEach((el) => {
      urls.push(el.image_url);
      isMain.push(el.image_isMain);
    });

    for (let i = 0; i < urls.length; i++) {
      await this.imagesRepository.save({
        url: urls[i],
        isMain: isMain[i],
        studyCafe: result,
      });
    }
    return;
  }

  // 이미지 업데이트
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
