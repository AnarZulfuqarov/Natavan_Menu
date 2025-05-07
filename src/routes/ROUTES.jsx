import MainPage from "../pages/index.jsx";
import AdminPage from "../components/AdminComponents/AdminPage/index.jsx";
import AdminContact from "../pages/AdminPages/AdminContact/index.jsx";
import AdminCategory from "../pages/AdminPages/AdminDoktor/index.jsx";


const router = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                path: "/",
            },
            {
                path: "/contact",
            },
            {
                path: "/portfolio",
            }
        ]
    },
    {
        path: "/admin",
        element: (
            // <ProtectedRoute>
                <AdminPage/>
            // </ProtectedRoute>
        ),
        children: [

            {
                path: "/admin/category",
                element: <AdminCategory/>
            },

            {
                path: "/admin/contact",
                element: <AdminContact/>
            }
        ]
    },
    {
      path: "/login",
      // element: <AdminLogin/>
    }
];

export default router;
