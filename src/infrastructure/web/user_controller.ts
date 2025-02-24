import { Request, Response } from "express";
import { UserService } from "../../application/services/user_service";
import { CreateUserDTO } from "../../application/dtos/create_user_dto";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    if (!req.body.name) {
      return res.status(400).json({ message: "Field name is required" });
    }
    try {
      const dto: CreateUserDTO = {
        name: req.body.name,
      };

      const user = await this.userService.createUser(dto);

      return res.status(201).json({
        message: "User created successfully",
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "Unexpected error" });
    }
  }
}
