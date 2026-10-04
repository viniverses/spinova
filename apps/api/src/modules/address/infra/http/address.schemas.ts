import { t as Type, type Static } from "elysia";
export {
  BadRequestResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  ValidationErrorResponseSchema,
} from "../../../../http/schemas/error.schemas.ts";

export const AddressSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  label: Type.String(),
  street: Type.String(),
  number: Type.String(),
  complement: Type.Nullable(Type.String()),
  neighborhood: Type.Nullable(Type.String()),
  city: Type.String(),
  state: Type.String(),
  zipCode: Type.String(),
  country: Type.String(),
  isDefault: Type.Boolean(),
});

export const AddressResponseSchema = Type.Object({
  data: AddressSchema,
});

export const AddressListResponseSchema = Type.Object({
  data: Type.Array(AddressSchema),
});

export const CreateAddressBodySchema = Type.Object(
  {
    label: Type.String({ minLength: 1, maxLength: 50 }),
    street: Type.String({ minLength: 1, maxLength: 255 }),
    number: Type.String({ minLength: 1, maxLength: 30 }),
    complement: Type.Optional(Type.Nullable(Type.String({ maxLength: 100 }))),
    neighborhood: Type.Optional(Type.Nullable(Type.String({ maxLength: 100 }))),
    city: Type.String({ minLength: 1, maxLength: 100 }),
    state: Type.String({ minLength: 1, maxLength: 100 }),
    zipCode: Type.String({ minLength: 8, maxLength: 20 }),
    country: Type.Optional(Type.String({ minLength: 2, maxLength: 2 })),
  },
  { additionalProperties: false },
);

export const UpdateAddressBodySchema = Type.Partial(CreateAddressBodySchema, {
  additionalProperties: false,
});

export const AddressParamsSchema = Type.Object(
  {
    addressId: Type.String({ format: "uuid" }),
  },
  { additionalProperties: false },
);

export const AddressDeleteResponseSchema = Type.Object({
  status: Type.Literal("deleted"),
});

export type AddressDto = Static<typeof AddressSchema>;
export type CreateAddressInput = Static<typeof CreateAddressBodySchema>;
export type CreateAddressInputDto = CreateAddressInput;
export type UpdateAddressInput = Static<typeof UpdateAddressBodySchema>;
export type UpdateAddressInputDto = UpdateAddressInput;
export type AddressParams = Static<typeof AddressParamsSchema>;
export type AddressDeleteResponse = Static<typeof AddressDeleteResponseSchema>;
