import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from '@/modules/category/service/category.service';
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { FileValidationUtil } from '@/common/utils/file-validation.util';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { DeleteCategoryDto } from '@/modules/category/dto/delete-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin } from '@/modules/auth/decorators/admin.decorator';

@ApiTags('admin', '分类模块')
@ApiBearerAuth()
@Admin()
@Controller('admin/category')
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '新增分类' })
  @Post()
  @UseInterceptors(FileInterceptor('category_image'))
  async createCategory(
    @UploadedFile() category_image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    if (!category_image) {
      throw new BadRequestException('没有上传文件');
    }

    if (!FileValidationUtil.isImage(category_image)) {
      throw new BadRequestException('文件类型必须是图片');
    }

    try {
      await this.categoryService.createCategoryWithImage(
        createCategoryDto,
        category_image,
      );
      return { message: '新增分类成功' };
    } catch (error) {
      return { code: HttpStatus.BAD_REQUEST, message: `新增失败: ${error}` };
    }
  }

  @ApiOperation({ summary: '查询所有分类' })
  @Get()
  async findAll() {
    const result = await this.categoryService.findAll();
    return { data: result };
  }

  @ApiOperation({ summary: '查询单个分类' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.categoryService.findCategoryById(id);
    return {
      code: HttpStatus.OK,
      data: result,
    };
  }

  @ApiOperation({ summary: '更新分类' })
  @Put()
  @UseInterceptors(FileInterceptor('category_image'))
  async updateCategory(
    @UploadedFile() category_image: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      if (category_image && !FileValidationUtil.isImage(category_image)) {
        throw new BadRequestException('文件类型必须是图片');
      }

      await this.categoryService.updateCategoryWithImage(
        updateCategoryDto,
        category_image,
      );

      return { message: '更新分类成功' };
    } catch (error) {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: `更新失败: ${error.message}`,
      };
    }
  }

  @ApiOperation({ summary: '删除分类' })
  @Delete()
  async delete(@Body(ValidationPipe) deleteCategory: DeleteCategoryDto) {
    await this.categoryService.deleteCategory(deleteCategory);
    return { message: '删除成功' };
  }
}
