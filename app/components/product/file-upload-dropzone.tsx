import {CloudUpload} from 'lucide-react';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../shadcn/dialog';

import {Button} from '../button';
import {useFetcher} from '@remix-run/react';
import {CheckCircle, Loader2} from 'lucide-react';

interface FileWithPreview extends File {
  preview: string;
}

const FileUploadDropzone: React.FC = () => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();

  const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
  const ALLOWED_FILE_TYPES = ['image/svg+xml', 'image/png', 'application/pdf'];
  const MAX_FILES = 1; // Changed to 1 maximum file

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload SVG, PDF or PNG.';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size too large. Maximum size is 8MB.';
    }

    return null;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError('');
      setUploadSuccess(false);

      // Take only the first file if multiple are dropped
      const newFile = acceptedFiles[0];

      if (!newFile) return;

      // Validate the file
      const validationError = validateFile(newFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Revoke previous object URL if there is one
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }

      // Create preview URL for the file
      const fileWithPreview = Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      }) as FileWithPreview;

      setFile(fileWithPreview);
      setIsUploading(true);

      try {
        // Create FormData and append the file
        const formData = new FormData();
        formData.append('file', newFile);

        // Use the fetcher to submit the form
        fetcher.submit(formData, {
          method: 'post',
          action: '/api/file-upload',
          encType: 'multipart/form-data',
        });

        // The upload status will be tracked by the useEffect watching fetcher state
      } catch (err) {
        console.error('Client-side upload error:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload file');
        setIsUploading(false);
      }
    },
    [file, fetcher],
  );

  const removeFile = (): void => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    setError('');
    setUploadSuccess(false);
    setIsUploading(false);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop([e.dataTransfer.files[0]]); // Just pass the first file
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop([e.target.files[0]]); // Just pass the first file
    }

    // Reset the input value so the same file can be selected again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  const renderFilePreview = (file: FileWithPreview): React.ReactNode => {
    if (file.type === 'application/pdf') {
      return (
        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-red-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    } else if (file.type.startsWith('image/')) {
      return (
        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
  };

  // Monitor fetcher state to update component state
  useEffect(() => {
    if (isUploading) {
      if (fetcher.state === 'idle') {
        // Upload completed
        if (fetcher.data && fetcher.data.success) {
          setUploadSuccess(true);
          setIsUploading(false);
        } else if (fetcher.data?.error) {
          setError(fetcher.data.error);
          setIsUploading(false);
        }
      }
    }
  }, [fetcher.state, fetcher.data, isUploading]);

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-500 bg-red-50'
            : isUploading
            ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
            : uploadSuccess
            ? 'border-green-500 bg-green-50 cursor-not-allowed'
            : file
            ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={!file && !isUploading ? handleDragEnter : undefined}
        onDragOver={!file && !isUploading ? handleDragOver : undefined}
        onDragLeave={!file && !isUploading ? handleDragLeave : undefined}
        onDrop={!file && !isUploading ? handleDrop : undefined}
        onClick={() => !file && !isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (!file && !isUploading && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label={
          isUploading
            ? 'File is uploading, please wait.'
            : uploadSuccess
            ? 'File uploaded successfully.'
            : file
            ? 'File selected. Please remove it to upload a different file.'
            : 'Upload file dropzone. Click or drag and drop a file here.'
        }
        aria-disabled={!!file || isUploading}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-blue-500" />
            ) : uploadSuccess ? (
              <CheckCircle className="size-5 text-green-500" />
            ) : (
              <CloudUpload
                className={`size-5 ${file ? 'text-gray-400' : 'text-primary'}`}
              />
            )}
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">
              {isUploading
                ? 'Uploading...'
                : uploadSuccess
                ? 'Upload Successful!'
                : file
                ? 'File selected'
                : 'Upload your logo here'}
            </p>
            <p className="text-xs text-gray-500">
              {isUploading
                ? 'Please wait while we upload your file'
                : uploadSuccess
                ? 'Your logo has been uploaded successfully'
                : file
                ? 'Remove file to upload a different one'
                : 'SVG, PDF or PNG'}
            </p>
            <input
              id="fileInput"
              name="file"
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept=".svg,.png,.pdf"
              ref={fileInputRef}
              disabled={!!file || isUploading}
            />
          </div>
        </div>
      </div>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      <div className="mt-1 text-xs text-gray-500">
        Not sure how to upload your logo? <LogoUploadGuide /> for the best
        results. Your uploaded logos are saved for your entire order. When
        ordering multiple customizable products, you only need to upload the
        logos to one of the products.
      </div>

      {file && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {isUploading ? 'Uploading file...' : 'Uploaded file (1/1)'}
          </h3>
          <div
            className={`flex justify-between items-center p-2 rounded-md border ${
              isUploading
                ? 'bg-blue-50 border-blue-200'
                : uploadSuccess
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {renderFilePreview(file)}
              <span className="text-sm text-gray-700 truncate max-w-xs">
                {file.name}
              </span>
              {isUploading && (
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              )}
              {uploadSuccess && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              aria-label={`Remove ${file.name}`}
              type="button"
              disabled={isUploading}
            >
              <svg
                className={`w-5 h-5 ${isUploading ? 'opacity-50' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!file && (
        <div className="mt-2">
          Note: If you choose to not upload your logo, after placing your order,
          we will reach out to gather the logo files from you and check them for
          print. Keep in mind that this may delay the production time of your
          order.
        </div>
      )}
    </div>
  );
};

export default FileUploadDropzone;

function LogoUploadGuide() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link" className="text-xs">
          Read the logo guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[100vh] md:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Logo Upload Guide</DialogTitle>
          <DialogDescription>
            Follow these tips for the best results with your customized products
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 overflow-y-auto pr-1">
          <div>
            <h3 className="text-sm font-medium mb-1">Format Recommendations</h3>
            <p className="text-sm text-gray-600">
              For best results, use a landscape-oriented logo. Our label designs
              are optimized for horizontal logos, which provide better
              visibility and aesthetic balance on our products.
            </p>
            <div className="flex space-x-4 mt-2">
              <div className="border rounded p-2 flex-1">
                <p className="text-xs text-center mb-1 text-green-600 font-medium">
                  Recommended
                </p>
                <div className="bg-gray-100 h-12 rounded flex items-center justify-center border">
                  <div className="bg-gray-300 w-24 h-8 rounded"></div>
                </div>
                <p className="text-xs text-center mt-1">Landscape format</p>
              </div>
              <div className="border rounded p-2 flex-1">
                <p className="text-xs text-center mb-1 text-amber-600 font-medium">
                  Not ideal
                </p>
                <div className="bg-gray-100 h-12 rounded flex items-center justify-center border">
                  <div className="bg-gray-300 w-8 h-8 rounded"></div>
                </div>
                <p className="text-xs text-center mt-1">Square format</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">File Type Priority</h3>
            <p className="text-sm text-gray-600">
              Choose the right file format for optimal printing quality:
            </p>
            <ol className="mt-2 space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium">SVG (Preferred)</p>
                  <p className="text-xs text-gray-600">
                    Vector format that scales perfectly at any size without
                    losing quality.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium">PDF</p>
                  <p className="text-xs text-gray-600">
                    Vector-based PDFs maintain quality at any scale and print
                    with crisp edges.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium">PNG</p>
                  <p className="text-xs text-gray-600">
                    Only use if vector formats are unavailable. Choose high
                    resolution (300+ DPI).
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Multiple Products</h3>
            <p className="text-sm text-gray-600">
              Your uploaded logos are saved for your entire order. When ordering
              multiple customizable products, you only need to upload the logos
              to one of the products.
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">NOTE:</span> In case we have
              questions, we will reach out to you via email. Please ensure you
              provide a valid email address during checkout.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Design Tips</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>
                Use simple designs with clear lines for best printing results
              </li>
              <li>
                Avoid very fine details that might not reproduce well at small
                sizes
              </li>
              <li>Ensure sufficient contrast between elements of your logo</li>
              <li>
                Consider how your logo will look in black and white if
                applicable
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
