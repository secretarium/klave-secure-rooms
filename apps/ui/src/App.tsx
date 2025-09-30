import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home, loader as HomeLoader } from './pages/home';
import { Drive, loader as DriveLoader } from './pages/drives/id';
import { Drives, loader as DrivesLoader } from './pages/drives';
import { ErrorPage } from './pages/error-page';
import { RootLayout } from './layouts/root-layout';
import secretariumHandler from './utils/secretarium-handler';
import { AuthLayout } from './layouts/auth-layout';
import { Auth } from './pages/auth';
import { Register, action as CreateUser } from './pages/auth/register';
import { SignIn, action as SignUserIn } from './pages/auth/keyname';
import { CreateSuperAdmin, action as CreateSAdmin } from './pages/auth/create-super-admin';
import { AdminLayout } from './layouts/admin-layout';
import { Admin, loader as AdminLoader } from './pages/admin';
import { Users, loader as UsersLoader } from './pages/admin/users';
import { Keys, loader as KeysLoader } from './pages/admin/keys';
// import { Test, loader as TestLoader } from './pages/admin/test';

secretariumHandler.initialize();

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
                loader: HomeLoader
            },
            {
                path: 'drives/:driveId',
                element: <Drive />,
                loader: DriveLoader
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Auth />
            },
            {
                path: 'create-super-admin',
                element: <CreateSuperAdmin />,
                action: CreateSAdmin
            },
            {
                path: 'register',
                element: <Register />,
                action: CreateUser
            },
            {
                path: ':keyname',
                element: <SignIn />,
                action: SignUserIn
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Admin />,
                loader: AdminLoader
            },
            {
                path: 'drives',
                element: <Drives />,
                loader: DrivesLoader
            },
            {
                path: 'drives/:driveId',
                element: <Drive />,
                loader: DriveLoader
            },
            {
                path: 'users',
                element: <Users />,
                loader: UsersLoader
            },
            {
                path: 'keys',
                element: <Keys />,
                loader: KeysLoader
            },
            // {
            //     path: 'test',
            //     element: <Test />,
            //     loader: TestLoader
            // }
        ]
    }
]);

export default function App() {
    return (
        <HelmetProvider>
            <RouterProvider router={router} />
        </HelmetProvider>
    );
}
