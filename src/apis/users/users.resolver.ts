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

  // 회원 가입
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create({ createUserInput });
  }

  // 회원 정보 조회
  @UseGuards(GqlAuthGuard('user-access'))
  @Query(() => User)
  fetchLoginUser(@Context() context: IContext): Promise<User> {
    const user_id = context.req.user.id;
    return this.usersService.findOneById({ user_id });
  }

  // 회원 정보 수정
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => Boolean)
  updateLoginUser(
    @Context() context: IContext,
    @Args('updateLoginUserInput') updateLoginUserInput: UpdateLoginUserInput,
  ): Promise<boolean> {
    const user_id = context.req.user.id;
    return this.usersService.update({ user_id, updateLoginUserInput });
  }

  // 회원 탈퇴(정보 삭제)
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => Boolean)
  deleteLoginUser(@Context() context: IContext): Promise<boolean> {
    const user_id = context.req.user.id;
    return this.usersService.softDelete({ user_id });
  }
}
