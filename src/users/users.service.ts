import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PhotosService } from 'src/photos/photos.service';
import { CreatePhotoDto } from 'src/photos/dto/create-photo.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private photosService: PhotosService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.usersRepository.create({
      username: createUserDto.username,
      passwordHash,
      status: createUserDto.status,
    });

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['photos'],
    });
    if (!user) {
      throw new HttpException(`User ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return { message: `User ${id} deleted successfully` };
  }

  async getPhotos(id: number) {
    const user = await this.findOne(id);
    return user.photos;
  }

  async getPhoto(id: number, photoId: number) {
    const user = await this.findOne(id);
    const photo = await this.photosService.findOne(photoId);
    if (photo.user.id !== user.id) {
      throw new HttpException(
        `User ${id} is not the owner of photo ${photoId}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return photo;
  }

  async addPhotoToUser(id: number, createPhotoDto: CreatePhotoDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException(`User ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    const photo = await this.photosService.create({
      ...createPhotoDto,
      user,
    });
    return photo;
  }
}
