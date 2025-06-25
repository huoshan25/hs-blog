import { IsArray, IsNumberString } from 'class-validator';

export class DeleteCategoryDto {
  @IsArray()
  @IsNumberString({}, { each: true })
  ids: string[];
}