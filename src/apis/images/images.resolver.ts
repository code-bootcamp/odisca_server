import { Args, Query, Resolver } from '@nestjs/graphql';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';

@Resolver()
export class ImagesResolver {
  constructor(private readonly imagesService: ImagesService) {}

  // 선택한 카페 메인 이미지 조회
  @Query(() => Image)
  fetchCafeMainImage(@Args('studyCafe_id') studyCafe_id: string) {
    return this.imagesService.findOneByStudyCafe({ studyCafe_id });
  }
}
