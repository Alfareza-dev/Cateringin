"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSlotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_slot_dto_1 = require("./create-slot.dto");
class UpdateSlotDto extends (0, swagger_1.PartialType)(create_slot_dto_1.CreateSlotDto) {
}
exports.UpdateSlotDto = UpdateSlotDto;
//# sourceMappingURL=update-slot.dto.js.map