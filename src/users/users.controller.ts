import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePhotoDto } from 'src/photos/dto/create-photo.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsAuthUserGuard } from './users.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthGuard, IsAuthUserGuard)
  @Get(':id/photos')
  async getPhotos(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getPhotos(id);
  }

  @UseGuards(AuthGuard, IsAuthUserGuard)
  @Get(':id/photos/:photoId')
  async getPhoto(
    @Param('id', ParseIntPipe) userId: number,
    @Param('photoId', ParseIntPipe) photoId: number,
  ) {
    return this.usersService.getPhoto(userId, photoId);
  }

  @UseGuards(AuthGuard, IsAuthUserGuard)
  @Post(':id/photos')
  async addPhotoToUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) createPhotoDto: CreatePhotoDto,
  ) {
    return this.usersService.addPhotoToUser(id, createPhotoDto);
  }
}
