import { Helmet } from 'react-helmet-async';
import { createUser, getUser, isConnected, listDrives } from '../utils/api';
import { Link, redirect, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';
import { Button } from '@klave-secure-rooms/ui-kit/ui';
import { useState } from 'react';
import { idToUrl } from '../utils/helpers';
import { Drives } from './drives';

type DriveRole = {
    driveId: string;
    role: string;
};

type HomeLoaderData = {
    drives: string[];
    userRoles: DriveRole[];
};

export const loader = async () => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const user = await getUser();
    const drives = await listDrives();
    console.log(user, drives);
    if (user.message === 'User not found') {
        return {
            drives: [],
            userRoles: []
        };
    }

    if (user.result.roles.find((role) => role.driveId === 'super')) {
        return redirect('/admin');
    }

    return {
        drives: user.result.roles.map((role) => role.driveId),
        userRoles: user.result.roles
    };
};

export const Home = () => {
    const { drives, userRoles } = useLoaderData() as HomeLoaderData;
    const revalidator = useRevalidator();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleJoinAsMember = async (id: string) => {
        const result = await createUser({ driveId: id, role: 'user' });

        if (result.success) {
            revalidator.revalidate();
            setSuccessMsg(result.message);
            setError(null);
            navigate('/admin/drives');
        } else {
            setError(result.message);
            setSuccessMsg(null);
        }
    };

    const handleJoinAsAdmin = async (id: string) => {
        const result = await createUser({ driveId: id, role: 'admin' });

        if (result.success) {
            setSuccessMsg(result.message);
            setError(null);
        } else {
            setError(result.message);
            setSuccessMsg(null);
        }
    };

    return (
        <>
            <Helmet>
                <title>Home | Secure Drives</title>
            </Helmet>
            <div className="flex flex-col gap-4 px-12 py-4">
                <div className="flex flex-col gap-2">
                    {drives.length > 0 ? (
                        <>
                            <h2 className="text-lg font-semibold">Available drives</h2>{' '}
                            {drives.map((id) => (
                                <div
                                    key={id}
                                    className="flex items-center justify-between gap-2 rounded-lg bg-slate-100 p-4"
                                >
                                    <h3 className="font-semibold">Drive ID: {id.substring(0, 8)}</h3>
                                    {userRoles.find((role) => role.driveId === id) ? (
                                        <div className="flex items-center gap-4">
                                            <p className="italic">
                                                Your status is: {userRoles.find((role) => role.driveId === id)?.role}
                                            </p>
                                            {userRoles.find((role) => role.driveId === id)?.role !== 'pending' ? (
                                                <Link to={`admin/drives/${idToUrl(id)}`}>
                                                    <Button>View drive</Button>
                                                </Link>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div className="flex gap-4">
                                            <Button onClick={() => handleJoinAsAdmin(id)}>Request admin access</Button>
                                            <Button onClick={() => handleJoinAsMember(id)}>Join as member</Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold">No drives</h2>{' '}
                            <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-100 p-4">
                                <h3 className="font-semibold">Create your drive</h3>
                                {
                                    <div className="flex gap-4">
                                            <Button onClick={() => handleJoinAsMember("")}>Join as member</Button>
                                    </div>
                                }
                            </div>
                        </>
                    )}
                </div>
                {error && <p className="overflow-clip text-red-500">{error}</p>}
                {successMsg && <p className="overflow-clip text-green-500">{successMsg}</p>}
            </div>
        </>
    );
};
