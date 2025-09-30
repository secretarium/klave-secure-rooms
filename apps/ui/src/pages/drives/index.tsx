import { Helmet } from 'react-helmet-async';
import { LoaderFunction, NavLink, redirect, useLoaderData } from 'react-router-dom';
import { isConnected, listDrives, getUser } from '../../utils/api';
import { ListDrivesResult } from '../../utils/types';
import { idToUrl } from '../../utils/helpers';

export const loader: LoaderFunction = async () => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const user = await getUser();
    const { result } = await listDrives();
    console.log('result', result);

    if (user.result.roles.length > 0) {
        const results: string[] = [user.result.roles[0].driveId];
        return {
            results
        };
    }
    else {
        return {
            result
        };
    }
};

export const Drives = () => {
    const { result } = useLoaderData() as ListDrivesResult;

    return (
        <>
            <Helmet>
                <title>Drives | Secure Drives</title>
            </Helmet>
            <div className="flex flex-col gap-4 px-12 py-4">
                <h2 className="text-lg font-semibold">Available Drive</h2>
                <div className="flex flex-col gap-2">
                    {result.map((id) => (
                        <NavLink
                            to={`/admin/drives/${idToUrl(id)}`}
                            key={id}
                            className="flex flex-col gap-2 rounded-lg bg-slate-100 p-4 transition-colors hover:bg-slate-200"
                        >
                            <h3 className="font-semibold">Drive ID: {id}</h3>
                            <p className="text-sm">Click to view contents</p>
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};
