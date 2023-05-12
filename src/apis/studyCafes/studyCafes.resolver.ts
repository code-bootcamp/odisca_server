import { Query, Resolver } from '@nestjs/graphql';
import { StudyCafesService } from './studyCafes.service';

@Resolver()
export class StudyCafesResolver {
  constructor(private readonly studyCafesService: StudyCafesService) {}

  // 필수 입력을 하고 싶지 않을 때  { nullable: true }
  @Query(() => String, { nullable: true })
  fetchStudyCafes(): string {
    return this.studyCafesService.qqq();
  }
}
