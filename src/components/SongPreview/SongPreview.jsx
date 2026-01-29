const SongPreview = ({ url, trackName, artistName, artworkUrl }) => {
  if (!url) {
    return null;
  }

  return (
    <div className="song-preview-card">
      <div className="song-preview-header">
        {artworkUrl && (
          <img
            src={artworkUrl}
            alt={trackName}
            className="song-preview-artwork"
          />
        )}
        <div className="song-preview-info">
          <span className="song-preview-track">{trackName}</span>
          <span className="song-preview-artist">{artistName}</span>
        </div>
      </div>
      <audio controls src={url} className="song-preview-audio">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default SongPreview;
