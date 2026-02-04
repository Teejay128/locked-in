import React, { useState } from 'react';

const ApiKeyComponent = ({ apiKey, loading, handleGenerateKey, handleDeleteKey, hitApi }) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.42-7.581a1.012 1.012 0 0 1 1.738 0l4.42 7.581a1.012 1.012 0 0 1 0 .639l-4.42 7.581a1.012 1.012 0 0 1-1.738 0l-4.42-7.581Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243-4.243-4.243" />
    </svg>
  );

  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375-3.375-3.375m0 0A9.06 9.06 0 0 1 12 12.75a9.06 9.06 0 0 1 5.625-2.002" />
    </svg>
  );

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );

  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
    </svg>
  );

  return (
    <div className="api-key-container">
      <h2>Your API Key</h2>
      {apiKey ? (
        <div className="api-key-display">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            readOnly
            placeholder="Your API Key"
          />
          <div className="api-key-actions">
            <button onClick={toggleShowKey} className="btn-icon" title={showKey ? 'Hide Key' : 'Reveal Key'}>
              {showKey ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
            <button onClick={copyToClipboard} className="btn-icon" title="Copy Key">
              {copied ? <span className="copied-text">Copied!</span> : <CopyIcon />}
            </button>
            <button onClick={handleDeleteKey} disabled={loading} className="btn-icon btn-danger" title="Delete Key">
              {loading ? <div className="loader" /> : <TrashIcon />}
            </button>
            <button onClick={hitApi} className="btn-icon btn-primary" title="Test Key">
              <PlayIcon />
            </button>
          </div>
        </div>
      ) : (
        <div className="api-key-actions">
          <button onClick={handleGenerateKey} disabled={loading} className="btn btn-primary">
            {loading ? 'Generating...' : 'Generate New Key'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyComponent;
