import { PropertyRepository } from "../../domain/repositories/property_repository";
import { Property } from "../../domain/entities/property";
import { PropertyMapper } from "../persistence/mappers/property_mapper";
import { Repository } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";

export class TypeORMPropertyRepository implements PropertyRepository {
  private readonly repository: Repository<PropertyEntity>;
  constructor(repository: Repository<PropertyEntity>) {
    this.repository = repository;
  }
  async save(property: Property): Promise<void> {
    const propertyEntity = PropertyMapper.toPersistence(property);
    await this.repository.save(propertyEntity);
  }
  async findById(id: string): Promise<Property | null> {
    const propertyEntity = await this.repository.findOne({ where: { id } });
    return propertyEntity ? PropertyMapper.toDomain(propertyEntity) : null;
  }
}
