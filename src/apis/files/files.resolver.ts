import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService, //
  ) {}

  @Mutation(() => [String])
  uploadImageFile(
    @Args({ name: 'images', type: () => [GraphQLUpload] }) images: FileUpload[], //
  ): Promise<string[]> {
    return this.filesService.upload({ images });
  }
}
