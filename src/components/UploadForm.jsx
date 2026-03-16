import { useState, useRef } from "react";
import { uploadSong } from "../api/songsApi";

const CloudUploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-16 h-16 text-green-400 mb-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5A4.5 4.5 0 018.25 10.5a6 6 0 0111.5 0 4.5 4.5 0 011.5 9H6.75z"
    />
  </svg>
);

const UploadForm = ({ refresh }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);

    try {
      await uploadSong(formData);

      setFile(null);
      setTitle("");
      setArtist("");
      setAlbum("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      refresh();
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data || err.message || "";
      const errorString = typeof backendError === 'string' ? backendError : JSON.stringify(backendError);

      if (errorString.includes("Only audio formatting is allowed") || errorString.includes("Invalid file type")) {
        setErrorMsg("Only Audio files are allowed");
        setTimeout(() => setErrorMsg(null), 4000);
      } else {
        window.alert(errorString || "An error occurred during upload.");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <>
      {errorMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2.5 rounded-full shadow-2xl z-[100] text-sm font-medium transition-all animate-pulse">
          {errorMsg}
        </div>
      )}
      <div className="bg-[#181818] p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`
            relative flex flex-col items-center justify-center
            rounded-xl py-10 px-6 cursor-pointer
            border-2 border-dashed transition-all duration-200
            ${isDragging
                ? "border-green-400 bg-green-500/10"
                : "border-gray-600 bg-[#1e1e1e] hover:border-green-500/60 hover:bg-[#222222]"
              }
          `}
          >
            <CloudUploadIcon />
            <p className="text-gray-300 text-base font-medium mb-1">
              Drag & Drop your file here
            </p>
            <p className="text-gray-500 text-sm mb-3">or</p>
            <span className="inline-block bg-green-500 hover:bg-green-400 text-black text-sm font-semibold px-5 py-2 rounded-full transition">
              Browse files
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Selected File Display */}
          {file && (
            <div className="flex items-center gap-3 bg-[#242424] border border-gray-700 rounded-lg px-4 py-3">
              <div className="flex-shrink-0 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="flex-shrink-0 text-gray-500 hover:text-red-400 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Song Metadata Fields */}
          <input
            className="w-full bg-[#242424] border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full bg-[#242424] border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
          <input
            className="w-full bg-[#242424] border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Album"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          />

          {/* Centered Upload Button */}
          <div className="flex justify-center pt-2">
            <button type="submit"
              className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-2.5 sm:py-3 rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!file}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadForm;
