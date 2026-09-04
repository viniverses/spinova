import { t as Type } from "elysia";
import { createErrorResponseSchema } from "../../schemas/error.schemas.ts";

export {
  InternalServerErrorResponseSchema,
  ValidationErrorResponseSchema,
} from "../../schemas/error.schemas.ts";

export const AddressSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  label: Type.String(),
  street: Type.String(),
  number: Type.String(),
  complement: Type.Union([Type.String(), Type.Null()]),
  neighborhood: Type.Union([Type.String(), Type.Null()]),
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
    complement: Type.Optional(
      Type.Union([Type.String({ maxLength: 100 }), Type.Null()])
    ),
    neighborhood: Type.Optional(
      Type.Union([Type.String({ maxLength: 100 }), Type.Null()])
    ),
    city: Type.String({ minLength: 1, maxLength: 100 }),
    state: Type.String({ minLength: 1, maxLength: 100 }),
    zipCode: Type.String({ minLength: 8, maxLength: 20 }),
    country: Type.Optional(Type.String({ minLength: 2, maxLength: 2 })),
  },
  { additionalProperties: false }
);

export const UpdateAddressBodySchema = Type.Partial(CreateAddressBodySchema, {
  additionalProperties: false,
});

export const AddressParamsSchema = Type.Object(
  {
    addressId: Type.String({ format: "uuid" }),
  },
  { additionalProperties: false }
);

export const UnauthorizedResponseSchema = createErrorResponseSchema("UNAUTHORIZED");
export const NotFoundResponseSchema = createErrorResponseSchema("ADDRESS_NOT_FOUND");
export const BadRequestResponseSchema = createErrorResponseSchema("ADDRESS_HAS_ORDERS");
