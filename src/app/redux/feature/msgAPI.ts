import baseApi from "../app/baseAPI";

const msgAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendMsg: build.mutation({
      query: (data) => ({
        url: `inbox/send-message/${data.receiverId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useSendMsgMutation } = msgAPI;
