import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import Cookies from "js-cookie";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://natavanmenu-001-site1.ltempurl.com/api',
        prepareHeaders: (headers) => {
            const token = Cookies.get('natavanToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        postAdminLogin: builder.mutation({
            query: (admin) => ({
                url: `/Admins/login`,
                method: 'POST',
                body: admin,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        getAllCategory: builder.query({
            query: () => ({
                url: `/Categorys`,
            }),
        }),
        getCategorysById: builder.query({
            query: (id) => ({
                url: `/Categorys/${id}`,
            }),
        }),
        putCategorys: builder.mutation({
            query: (category) => ({
                url: `/Categorys`,
                method: 'PUT',
                body: category,
            }),
        }),
        postCategorys: builder.mutation({
            query: (data) => ({
                url: `/Categorys`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteCategorys: builder.mutation({
            query: (id) => ({
                url: `/Categorys/?id=${id}`,
                method: 'DELETE',
            }),
        }),
        getAllProducts: builder.query({
            query: () => ({
                url: `/Products`,
            }),
        }),

        putProducts: builder.mutation({
            query: (clinic) => ({
                url: `/Products`,
                method: 'PUT',
                body: clinic,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        postProducts: builder.mutation({
            query: (data) => ({
                url: `/Products`,
                method: 'POST',
                body: data,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        deleteProducts: builder.mutation({
            query: (id) => ({
                url: `/Products/?id=${id}`,
                method: 'DELETE',
            }),
        }),

    }),
})
export const {
    usePostAdminLoginMutation,

    useGetAllCategoryQuery,
    usePutCategorysMutation,
    useDeleteCategorysMutation,
    usePostCategorysMutation,
    useGetCategorysByIdQuery,

    useGetAllProductsQuery,
    usePutProductsMutation,
    useDeleteProductsMutation,
    usePostProductsMutation,


} = userApi