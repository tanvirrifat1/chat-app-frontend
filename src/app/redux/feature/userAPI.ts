import baseApi from "../app/baseAPI";

const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signUp: build.mutation({
      query: (data) => ({
        url: "/user/create-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    verifyEmail: build.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    login: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getAllUsers: build.query({
      query: () => ({
        url: "/user/get-all-users",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useGetAllUsersQuery,
} = authAPI;
