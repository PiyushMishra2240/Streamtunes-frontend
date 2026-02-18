import { useState } from "react";
import { uploadSong } from "../api/songsApi";

const UploadForm = ({ refresh }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);

    await uploadSong(formData);

    setFile(null);
    setTitle("");
    setArtist("");
    setAlbum("");
    refresh();
  };

  return (
    <div className="bg-[#181818] p-8 rounded-2xl shadow-xl border border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="block cursor-pointer bg-[#181818] border border-gray-700 rounded-lg px-4 py-3 hover:bg-[#242424] transition">
        <span className="text-sm text-gray-400">Choose audio file</span>
          <input type="file" 
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
          onChange={(e) => setFile(e.target.files[0])} 
          required />
        </label>
        <input 
          className="w-full bg-[#242424] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full bg-[#242424] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <input
          className="w-full bg-[#242424] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="Album"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
        <button type="submit"
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-full transition">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
