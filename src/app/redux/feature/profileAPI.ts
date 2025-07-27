import baseApi from "../app/baseAPI";

const profileAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetProfileQuery } = profileAPI;
