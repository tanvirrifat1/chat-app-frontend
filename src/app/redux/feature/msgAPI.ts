import baseApi from "../app/baseAPI";

const msgAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendMsg: build.mutation({
      query: (data) => ({
        url: `/inbox/send-message/${data.receiverId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Message"],
    }),

    getMyInbox: build.query({
      query: () => ({
        url: `/inbox/get-inbox`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["Message"],
    }),

    getMyMessages: build.query({
      query: (id) => ({
        url: `/message/get-message/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const { useSendMsgMutation, useGetMyInboxQuery, useGetMyMessagesQuery } =
  msgAPI;
