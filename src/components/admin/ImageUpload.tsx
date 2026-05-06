import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { storage } from '../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

export function ImageUpload({ 
    images, 
    onChange 
} : { 
    images: string[], 
    onChange: (images: string[]) => void 
}) {
    const [uploading, setUploading] = useState(false);
    
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setUploading(true);
        const newImages = [...images];

        try {
            for (const file of acceptedFiles) {
                // simple unique name
                const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(fileRef, file);
                
                await new Promise<void>((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        null, 
                        (error) => reject(error), 
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            newImages.push(url);
                            resolve();
                        }
                    );
                });
            }
            onChange(newImages);
            toast.success("Images uploadées avec succès");
        } catch (err: any) {
            toast.error("Erreur lors de l'upload: " + err.message);
        } finally {
            setUploading(false);
        }
    }, [images, onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-black bg-neutral-50' : 'border-neutral-300 hover:border-black'}`}
            >
                <input {...getInputProps()} />
                <div className="flex justify-center mb-4">
                    <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-black' : 'text-neutral-400'}`} />
                </div>
                <p className="text-sm font-medium text-black">
                    {isDragActive ? "Relâchez pour uploader" : "Glissez & déposez vos images ici"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">Ou cliquez pour parcourir</p>
            </div>

            {uploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 py-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...
                </div>
            )}

            {images.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-neutral-200">
                            <img src={url} alt="Product preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button" 
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    className="bg-white text-black p-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
