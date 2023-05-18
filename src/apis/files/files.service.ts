import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { IFilesServiceUploadImage } from './interfaces/files-service.interface';

@Injectable()
export class FilesService {
  // 구글 클라우드에 이미지 업로드
  async upload({ images }: IFilesServiceUploadImage): Promise<string[]> {
    const totalImages = await Promise.all(images);
    const waitedImages = [];
    totalImages.map((el) => waitedImages.push(el));

    const bucket = 'wisc-storage';
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_ID,
      keyFilename: 'gcp-file-storage.json',
    }).bucket(bucket);

    const results = await Promise.all(
      waitedImages.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () =>
                resolve(
                  `https://storage.googleapis.com/${bucket}/${el.filename}`,
                ),
              )
              .on('error', () => reject('업로드 실패'));
          }),
      ),
    );
    console.log('파일 업로드 성공');
    return results;
  }
}
