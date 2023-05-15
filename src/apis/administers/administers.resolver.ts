import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/common/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { AdministersService } from './administers.service';
import { CreateAdministerInput } from './dto/create-administer.input';
import { UpdateLoginAdministerInput } from './dto/update-login-administer.input';
import { Administer } from './entities/administer.entity';

@Resolver()
export class AdministersResolver {
  constructor(private readonly administersService: AdministersService) {}

  @Mutation(() => Administer)
  createAdminister(
    @Args('createAdministerInput') createAdministerInput: CreateAdministerInput,
  ): Promise<Administer> {
    return this.administersService.create({ createAdministerInput });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => Administer)
  fetchLoginAdminister(@Context() context: IContext) {
    const adminId = context.req.user.id;
    return this.administersService.findOneById({ adminId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Administer)
  updateLoginAdminister(
    @Context() context: IContext,
    @Args('updateLoginAdministerInput')
    updateLoginAdministerInput: UpdateLoginAdministerInput,
  ) {
    const adminId = context.req.user.id;
    return this.administersService.update({
      adminId,
      updateLoginAdministerInput,
    });
  }
}
