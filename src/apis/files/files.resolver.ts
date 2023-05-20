import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService, //
  ) {}

  @Mutation(() => [String])
  uploadImageFile(
    @Args({ name: 'images', type: () => [GraphQLUpload] }) images: FileUpload[],
  ): Promise<string[]> {
    return this.filesService.upload({ images });
  }
}
