import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { DataSource, Repository } from 'typeorm';
// import { Visit } from '../visit/entities/visit.entity';
import { IReviewsServiceCreate } from './interfaces/reviews-service.interface';
import { Visit } from '../visit/entities/visit.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    private readonly dataSource: DataSource,
  ) {}

  async create({
    content, //
    user, //
    visitId, //
  }: IReviewsServiceCreate): Promise<Review> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const visit = this.visitRepository.findOne({ where: { id: visitId } });

      if (visit) {
        const review = this.reviewsRepository.create({
          content,
          user,
        });

        await queryRunner.manager.save(review);

        return review;
      } else {
        throw new UnprocessableEntityException(
          '방문기록이 없으므로 리뷰 작성이 불가능합니다.',
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
