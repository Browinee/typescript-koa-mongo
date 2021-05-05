import {IsOptional, IsString, ValidateNested} from "class-validator";
import CreateAddressDto from "./address.dto";


class CreateUserDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @ValidateNested()
    address?: CreateAddressDto;


}

export default CreateUserDto;