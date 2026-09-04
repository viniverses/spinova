import { Elysia, t as Type } from "elysia";
import { betterAuthPlugin } from "../../plugins/better-auth.ts";
import { NotFoundError, BadRequestError } from "../../errors/index.ts";
import {
  getAddressesByUserId,
  getDefaultAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./address.repository.ts";
import {
  AddressListResponseSchema,
  AddressResponseSchema,
  CreateAddressBodySchema,
  UpdateAddressBodySchema,
  AddressParamsSchema,
  UnauthorizedResponseSchema,
  NotFoundResponseSchema,
  BadRequestResponseSchema,
  InternalServerErrorResponseSchema,
  ValidationErrorResponseSchema,
} from "./address.schemas.ts";

export const addressRoutes = new Elysia({
  name: "address-routes",
})
  .use(betterAuthPlugin)
  .get(
    "/addresses",
    async ({ user }) => {
      const addresses = await getAddressesByUserId(user.id);
      return { data: addresses };
    },
    {
      auth: true,
      detail: { tags: ["Addresses"] },
      response: {
        200: AddressListResponseSchema,
        401: UnauthorizedResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
    }
  )
  .get(
    "/addresses/default",
    async ({ user }) => {
      const address = await getDefaultAddress(user.id);
      if (!address) {
        throw new NotFoundError({
          code: "ADDRESS_NOT_FOUND",
          message: "Default address not found.",
        });
      }
      return { data: address };
    },
    {
      auth: true,
      detail: { tags: ["Addresses"] },
      response: {
        200: AddressResponseSchema,
        401: UnauthorizedResponseSchema,
        404: NotFoundResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
    }
  )
  .post(
    "/addresses",
    async ({ user, body, set }) => {
      const address = await createAddress(user.id, body);
      set.status = 201;
      return { data: address };
    },
    {
      auth: true,
      body: CreateAddressBodySchema,
      detail: { tags: ["Addresses"] },
      response: {
        201: AddressResponseSchema,
        401: UnauthorizedResponseSchema,
        422: ValidationErrorResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
    }
  )
  .patch(
    "/addresses/:addressId",
    async ({ user, params: { addressId }, body }) => {
      const result = await updateAddress(user.id, addressId, body);
      if (result.status === "not-found") {
        throw new NotFoundError({
          code: "ADDRESS_NOT_FOUND",
          message: "Address not found.",
        });
      }
      return { data: result.data };
    },
    {
      auth: true,
      params: AddressParamsSchema,
      body: UpdateAddressBodySchema,
      detail: { tags: ["Addresses"] },
      response: {
        200: AddressResponseSchema,
        401: UnauthorizedResponseSchema,
        404: NotFoundResponseSchema,
        422: ValidationErrorResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
    }
  )
  .delete(
    "/addresses/:addressId",
    async ({ user, params: { addressId } }) => {
      const result = await deleteAddress(user.id, addressId);
      if (result.status === "not-found") {
        throw new NotFoundError({
          code: "ADDRESS_NOT_FOUND",
          message: "Address not found.",
        });
      }
      if (result.status === "has-orders") {
        throw new BadRequestError({
          code: "ADDRESS_HAS_ORDERS",
          message: "Cannot delete address linked to orders.",
        });
      }
      return { status: "deleted" };
    },
    {
      auth: true,
      params: AddressParamsSchema,
      detail: { tags: ["Addresses"] },
      response: {
        200: Type.Object({ status: Type.String() }),
        400: BadRequestResponseSchema,
        401: UnauthorizedResponseSchema,
        404: NotFoundResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
    }
  );
