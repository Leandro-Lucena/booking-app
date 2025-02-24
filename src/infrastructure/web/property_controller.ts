import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  async createProperty(req: Request, res: Response): Promise<Response> {
    if (!req.body.name) {
      return res.status(400).json({ message: "Property name is required" });
    }
    if (!req.body.maxGuests || req.body.maxGuests <= 0) {
      return res
        .status(400)
        .json({ message: "Max guests must be greater than 0" });
    }
    if (!req.body.basePricePerNight || req.body.basePricePerNight <= 0) {
      return res
        .status(400)
        .json({ message: "Base price per night is required" });
    }

    try {
      const dto: CreatePropertyDTO = {
        name: req.body.name,
        description: req.body.description,
        maxGuests: req.body.maxGuests,
        basePricePerNight: req.body.basePricePerNight,
      };

      const property = await this.propertyService.createProperty(dto);

      return res.status(201).json({
        message: "Property created successfully",
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "Unexpected error" });
    }
  }
}
