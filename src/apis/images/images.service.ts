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

  // 해당 카페 전체 이미지 조회
  findByStudyCafe({ result }) {
    return this.imagesRepository.find({ where: { studyCafe: result } });
  }

  // 선택한 카페 메인 이미지 조회
  findOneByStudyCafe({ studyCafeId }) {
    return this.imagesRepository.findOne({
      where: { studyCafe: { id: studyCafeId } } && { isMain: true },
    });
  }

  // 이미지 저장
  async createCafeImage({ image, result }: IImagesServiceCreate) {
    const urls = [];
    const isMain = [];
    image.forEach((el) => {
      urls.push(el.url);
      isMain.push(el.isMain);
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
        id: images[i].id,
      });
    }
    return this.createCafeImage({ image, result });
  }
}
