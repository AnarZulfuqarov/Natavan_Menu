import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import Cookies from "js-cookie";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://klinikenalianz-001-site1.ltempurl.com/api',
        prepareHeaders: (headers) => {
            const token = Cookies.get('klinikenToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        postAdminLogin: builder.mutation({
            query: (admin) => ({
                url: `/Admin/login`,
                method: 'POST',
                body: admin,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        getAllCategory: builder.query({
            query: () => ({
                url: `/Category/get-all-categories`,
            }),
        }),
        getCategoryById: builder.query({
            query: (id) => ({
                url: `/Category/get-category-by-id/${id}`,
            }),
        }),
        putCategory: builder.mutation({
            query: (category) => ({
                url: `/Category/update-category`,
                method: 'PUT',
                body: category,
            }),
        }),
        postCategory: builder.mutation({
            query: (data) => ({
                url: `/Category/create-category`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/Category/delete-category/${id}`,
                method: 'DELETE',
            }),
        }),
        getAllClinic: builder.query({
            query: () => ({
                url: `/Clinic/get-all-clinics`,
            }),
        }),
        getClinicById: builder.query({
            query: (id) => ({
                url: `/Clinic/get-clinic-by-id/${id}`,
            }),
        }),
        putClinic: builder.mutation({
            query: (clinic) => ({
                url: `/Clinic/update-clinic`,
                method: 'PUT',
                body: clinic,
            }),
        }),
        postClinic: builder.mutation({
            query: (data) => ({
                url: `/Clinic/create-clinic`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteClinic: builder.mutation({
            query: (id) => ({
                url: `/Clinic/delete-clinic/${id}`,
                method: 'DELETE',
            }),
        }),
        getAllDoctors: builder.query({
            query: () => ({
                url: `/Doctors/get-all-doctors`,
            }),
        }),
        getDoctorsById: builder.query({
            query: (id) => ({
                url: `/Doctors/get-doctor-by-id/${id}`,
            }),
        }),
        putDoctors: builder.mutation({
            query: (doctor) => ({
                url: `/Doctors/update-doctor`,
                method: 'PUT',
                body: doctor,
            }),
        }),
        postDoctors: builder.mutation({
            query: (data) => ({
                url: `/Doctors/create-doctor`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteDoctors: builder.mutation({
            query: (id) => ({
                url: `/Doctors/delete-doctor/${id}`,
                method: 'DELETE',
            }),
        }),
        getAllService: builder.query({
            query: () => ({
                url: `/Service/get-all-services`,
            }),
        }),
        getServiceById: builder.query({
            query: (id) => ({
                url: `/Service/get-service-by-id/${id}`,
            }),
        }),
        putService: builder.mutation({
            query: (service) => ({
                url: `/Service/update-service`,
                method: 'PUT',
                body: service,
            }),
        }),
        postService: builder.mutation({
            query: (data) => ({
                url: `/Service/create-service`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `/Service/delete-service/${id}`,
                method: 'DELETE',
            }),
        }),
        postContact: builder.mutation({
            query: (contact) => ({
                url: `/Contact/create-contact`,
                method: 'POST',
                body: contact,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        getAllContact: builder.query({
            query: () => ({
                url: `/Contact/get-all-contacts`,
            }),
        }),
    }),
})
export const {
    usePostAdminLoginMutation,

    useGetAllCategoryQuery,
    useGetCategoryByIdQuery,
    usePutCategoryMutation,
    useDeleteCategoryMutation,
    usePostCategoryMutation,

    useGetAllClinicQuery,
    useGetClinicByIdQuery,
    usePutClinicMutation,
    useDeleteClinicMutation,
    usePostClinicMutation,

    useGetAllDoctorsQuery,
    useGetDoctorsByIdQuery,
    usePutDoctorsMutation,
    useDeleteDoctorsMutation,
    usePostDoctorsMutation,

    useGetAllServiceQuery,
    useGetServiceByIdQuery,
    usePutServiceMutation,
    useDeleteServiceMutation,
    usePostServiceMutation,

    usePostContactMutation,
    useGetAllContactQuery,
} = userApi