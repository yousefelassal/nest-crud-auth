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

  findAll(status?: string): Promise<User[]> {
    return this.usersRepository.find({ where: { status } });
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

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
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
    return this.photosService.findAll(user);
  }

  async getPhoto(userId: number, photoId: number) {
    const user = await this.findOne(userId);
    const photo = await this.photosService.findOne(photoId);
    if (photo.user.id !== user.id) {
      throw new HttpException(
        `Photo ${photoId} not found for user ${userId}`,
        HttpStatus.BAD_REQUEST,
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
