import { Helmet } from 'react-helmet-async';
import { createDrive, isConnected, listDrives } from '../../utils/api';
import { redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { ListDrivesResult } from '../../utils/types';
import { Button } from '@klave-secure-rooms/ui-kit/ui';
import { Plus } from 'lucide-react';

export const loader = async () => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const res = await listDrives();

    return {
        result: res.result
    };
};

export const Admin = () => {
    const navigate = useNavigate();
    const { result } = useLoaderData() as ListDrivesResult;

    const handleCreateDrive = async () => {
        await createDrive().catch((error) => {
            console.error(error);
            return error;
        });
        navigate('/admin/drives');
    };

    return (
        <>
            <Helmet>
                <title>Admin | Secure Drive</title>
            </Helmet>
            <div className="flex flex-col gap-4 px-12 py-4">
                <h2 className="text-lg font-semibold">Home</h2>
                {result.length > 0 ? (
                    <p className="italic">Welcome to Secure Drive!</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="italic">No drives found. Please create one by clicking the button below.</p>
                        <Button className="w-48 transition-colors hover:bg-slate-700" onClick={handleCreateDrive}>
                            Create Drive
                            <Plus className="ml-2 h-6 w-6" />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};
