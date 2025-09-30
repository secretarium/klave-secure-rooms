import { Helmet } from 'react-helmet-async';
import { LoaderFunction, redirect, useLoaderData, useParams } from 'react-router-dom';
import { getDriveContent, getUser, isConnected } from '../../utils/api';
import { urlToId } from '../../utils/helpers';
import { DriveFile } from '../../utils/types';
import { LockOpen, Lock, File } from 'lucide-react';
import { Dropzone } from '../../components/dropzone';
import { useState } from 'react';
import { loadFile } from '../../utils/fileTools';

type DriveLoaderData = {
    userRole: string;
    Drive: {
        locked: boolean;
        files: DriveFile[];
    };
};

export const loader: LoaderFunction = async ({ params }) => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const { driveId } = params;

    if (!driveId) return { status: 404 };

    const result = await getDriveContent(urlToId(driveId));
    const user = await getUser();
    const isSuper = user.result.roles.find((role) => role.driveId === 'super');

    return {
        Drive: result.result,
        userRole: isSuper ? 'admin' : user.result.roles.find((role) => role.driveId === urlToId(driveId))?.role
    };
};

export const Drive = () => {
    const { driveId } = useParams<{ driveId: string }>();
    const { userRole, Drive } = useLoaderData() as DriveLoaderData;
    const [files, setFiles] = useState<string[]>([]);

    const handleDownload = async (file: DriveFile) => {
        const doneFile = await loadFile({
            name: file.name,
            type: file.type,
            size: -1,
            key: file.key,
            digest: file.digestB64,
            token: file.tokenB64,
        }, false);

        const link = document.createElement('a');

        link.download = file.name;
        link.href = doneFile.downloadUrl ?? '#';
        link.target = '_blank';
        link.click();
    };

    return (
        <>
            <Helmet>
                <title>Drive: {driveId?.substring(0, 8)} | Secure Drives</title>
            </Helmet>
            <div className="flex flex-col gap-4 px-12 py-4">
                <h2 className="text-lg font-semibold">Drive ID: {urlToId(driveId ?? '')}</h2>
                <Dropzone onChange={setFiles} className="h-48 w-full" />
                <div className="flex flex-col gap-2">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        Contents{' '}
                        {Drive.locked ? (
                            <>
                                locked <Lock />
                            </>
                        ) : (
                            <>
                                unlocked <LockOpen />
                            </>
                        )}
                    </h2>
                    {Drive.files.length === 0 && <p className="italic">No files uploaded yet</p>}
                    {Drive.files.map((file) => (
                        <div key={file.id} className="flex items-center gap-2 rounded-lg bg-slate-100 p-4">
                            <File className="h-8 w-8" />
                            <div className="gap flex flex-col">
                                <h3 className="flex items-center gap-2 font-semibold">File name: {file.name}</h3>
                                <p className="text-sm">
                                    <button
                                        onClick={() => { handleDownload(file) }}
                                        className="hover:underline"
                                    >
                                        Download file
                                    </button>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
