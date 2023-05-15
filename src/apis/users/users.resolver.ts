import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/common/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateLoginUserInput } from './dto/update-login-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // 회원등록
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create({ createUserInput });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => User)
  fetchLoginUser(@Context() context: IContext) {
    const userId = context.req.user.id;
    return this.usersService.findOneById({ userId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => User)
  updateLoginUser(
    @Context() context: IContext,
    @Args('updateLoginUserInput') updateLoginUserInput: UpdateLoginUserInput,
  ) {
    const userId = context.req.user.id;
    return this.usersService.update({ userId, updateLoginUserInput });
  }
}
