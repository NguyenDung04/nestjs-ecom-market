import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryLog } from './entities/inventory-log.entity';
import { InventoryLogsService } from './inventory-logs.service';
import { InventoryLogsController } from './inventory-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryLog])],
  controllers: [InventoryLogsController],
  providers: [InventoryLogsService],
  exports: [TypeOrmModule, InventoryLogsService],
})
export class InventoryLogsModule {}
