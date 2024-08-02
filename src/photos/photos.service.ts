import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  create(createPhotoDto: CreatePhotoDto) {
    const photo = this.photosRepository.create(createPhotoDto);
    return this.photosRepository.save(photo);
  }

  findAll(user?: User): Promise<Photo[]> {
    return this.photosRepository.find({
      where: { user },
    });
  }

  async findOne(id: number): Promise<Photo | undefined> {
    const photo = await this.photosRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!photo) {
      throw new HttpException(`Photo ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    return photo;
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    await this.photosRepository.update(id, updatePhotoDto);
    return this.photosRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.photosRepository.delete(id);
    return { message: `Photo ${id} deleted successfully` };
  }
}
