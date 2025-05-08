import MainPage from "../pages/index.jsx";
import AdminPage from "../components/AdminComponents/AdminPage/index.jsx";
import AdminCategory from "../pages/AdminPages/AdminCategory/index.jsx";
import AdminFood from "../pages/AdminPages/AdminFood/index.jsx";
import LoadingPage from "../pages/UserPages/LoadingPage/index.jsx";
import CategoryPage from "../pages/UserPages/CategoryPage/index.jsx";
import MenuPage from "../pages/UserPages/MenuPage/index.jsx";
import AdminLogin from "../pages/AdminPages/AdminLogin/index.jsx";
import ProtectedRoute from "../ProtectedRoute.jsx";


const router = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                path: "/",
                element: <LoadingPage/>
            },
            {
                path: "/category",
                element: <CategoryPage/>
            },
            {
                path: "/menu/:id",
                element: <MenuPage/>
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminPage/>
            </ProtectedRoute>
        ),
        children: [

            {
                path: "/admin/category",
                element: <AdminCategory/>
            },

            {
                path: "/admin/food",
                element: <AdminFood/>
            }
        ]
    },
    {
      path: "/login",
      element: <AdminLogin/>
    }
];

export default router;
