// store/apis/roomApi.ts
import { baseQueryWithReauth } from "@/auth/baseApi";
import type { RoomRequest } from "@/types/requestTypes";
import type { RoomResponse } from "@/types/responseTypes";
import { createApi } from "@reduxjs/toolkit/query/react";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Room"],
  endpoints(builder) {
    return {
      getRooms: builder.query<RoomResponse[], void>({
        query: () => ({
          url: "rooms",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "Room" as const, id })),
                { type: "Room", id: "LIST" },
              ]
            : [{ type: "Room", id: "LIST" }],
      }),

      getRoomById: builder.query<RoomResponse, number>({
        query: (id) => `rooms/${id}`,
        providesTags: (result, error, id) => [{ type: "Room", id }],
      }),

      createRoom: builder.mutation<RoomResponse, RoomRequest>({
        query: (newRoom) => ({
          url: "rooms",
          method: "POST",
          body: newRoom,
        }),
        invalidatesTags: [{ type: "Room", id: "LIST" }],
      }),

      updateRoom: builder.mutation<
        RoomResponse,
        { id: number; room: RoomRequest }
      >({
        query: ({ id, room }) => ({
          url: `rooms/${id}`,
          method: "PUT",
          body: room,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Room", id }],
      }),

      deleteRoom: builder.mutation<void, number>({
        query: (id) => ({
          url: `rooms/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "Room", id },
          { type: "Room", id: "LIST" },
        ],
      }),
    };
  },
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
