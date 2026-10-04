import { betterAuthPlugin } from "../../../../http/plugins/better-auth.ts";
import { Elysia } from "elysia";

import { CreateAddressUseCase } from "../../application/use-cases/create-address.use-case.ts";
import { DeleteAddressUseCase } from "../../application/use-cases/delete-address.use-case.ts";
import { GetDefaultAddressUseCase } from "../../application/use-cases/get-default-address.use-case.ts";
import { ListAddressesUseCase } from "../../application/use-cases/list-addresses.use-case.ts";
import { UpdateAddressUseCase } from "../../application/use-cases/update-address.use-case.ts";
import type { AddressOrderLookup } from "../../application/ports/address-order-lookup.interface.ts";
import {
  AddressDeleteResponseSchema,
  AddressListResponseSchema,
  AddressParamsSchema,
  AddressResponseSchema,
  BadRequestResponseSchema,
  CreateAddressBodySchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
  UpdateAddressBodySchema,
  ValidationErrorResponseSchema,
} from "./address.schemas.ts";
import type { IAddressRepository } from "../../domain/repositories/address.repository.interface.ts";
import { addressErrorMapper } from "./address.error-mapper.ts";

export interface AddressRoutesDependencies {
  addressRepository: IAddressRepository;
  addressOrderLookup: AddressOrderLookup;
}

export const createAddressRoutes = (deps: AddressRoutesDependencies) => {
  const listAddressesUseCase = new ListAddressesUseCase(deps.addressRepository);
  const getDefaultAddressUseCase = new GetDefaultAddressUseCase(
    deps.addressRepository,
  );
  const createAddressUseCase = new CreateAddressUseCase(deps.addressRepository);
  const updateAddressUseCase = new UpdateAddressUseCase(deps.addressRepository);
  const deleteAddressUseCase = new DeleteAddressUseCase(
    deps.addressRepository,
    deps.addressOrderLookup,
  );

  return new Elysia({
    prefix: "/addresses",
    name: "address-routes",
    normalize: "typebox",
  })
    .use(betterAuthPlugin)
    .use(addressErrorMapper)
    .get(
      "/",
      async ({ user }) => {
        const addresses = await listAddressesUseCase.execute({
          userId: user.id,
        });
        return { data: addresses };
      },
      {
        auth: true,
        response: {
          200: AddressListResponseSchema,
          401: UnauthorizedResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "listAddresses",
          summary: "List addresses",
          description:
            "Returns all saved shipping and billing addresses for the authenticated user.",
          tags: ["Addresses"],
        },
      },
    )
    .get(
      "/default",
      async ({ user }) => {
        const address = await getDefaultAddressUseCase.execute({
          userId: user.id,
        });
        return { data: address };
      },
      {
        auth: true,
        response: {
          200: AddressResponseSchema,
          401: UnauthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "getDefaultAddress",
          summary: "Get default address",
          description:
            "Returns the authenticated user's primary/default shipping address.",
          tags: ["Addresses"],
        },
      },
    )
    .post(
      "/",
      async ({ user, body, set }) => {
        const address = await createAddressUseCase.execute({
          userId: user.id,
          data: body,
        });
        set.status = 201;
        return { data: address };
      },
      {
        auth: true,
        body: CreateAddressBodySchema,
        response: {
          201: AddressResponseSchema,
          401: UnauthorizedResponseSchema,
          422: ValidationErrorResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "createAddress",
          summary: "Create address",
          description:
            "Creates a new shipping or billing address for the authenticated user.",
          tags: ["Addresses"],
        },
      },
    )
    .patch(
      "/:addressId",
      async ({ user, params: { addressId }, body }) => {
        const address = await updateAddressUseCase.execute({
          userId: user.id,
          addressId,
          data: body,
        });
        return { data: address };
      },
      {
        auth: true,
        params: AddressParamsSchema,
        body: UpdateAddressBodySchema,
        response: {
          200: AddressResponseSchema,
          401: UnauthorizedResponseSchema,
          404: NotFoundResponseSchema,
          422: ValidationErrorResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "updateAddress",
          summary: "Update address",
          description:
            "Updates details of an existing address for the authenticated user.",
          tags: ["Addresses"],
        },
      },
    )
    .delete(
      "/:addressId",
      async ({ user, params: { addressId } }) => {
        await deleteAddressUseCase.execute({ userId: user.id, addressId });
        return { status: "deleted" as const };
      },
      {
        auth: true,
        params: AddressParamsSchema,
        response: {
          200: AddressDeleteResponseSchema,
          400: BadRequestResponseSchema,
          401: UnauthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: InternalServerErrorResponseSchema,
        },
        detail: {
          operationId: "deleteAddress",
          summary: "Delete address",
          description:
            "Deletes a specified address for the authenticated user if it has no associated orders.",
          tags: ["Addresses"],
        },
      },
    );
};
