'use client';

import React, { useState } from 'react';

const AESEncryption = () => {
  const [inputText, setInputText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // C# kodundaki sabit anahtar
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "LHE7I0VKNYFQEPI37VXWNHSQYJ1Z9TY3Z7IIRZ3EBX8F9WZKWG04VAFJ5AN2H79AZUZ7G1W259W2EUD6E454BPFDF5F7A7N5X56JTI7QYMXFJDJ3ZZK6M6NJONYFXBHNMOIFAOHFALYN1O0ABLROUJPSS7PQR7BI7IB80AX105VPQCQLKGJW8WR7BX52CF7LLPZATTTII4Z3KZNQ0BUEM2I6QOIVNLCS8QJZ3X05MS2H389CUOCP9ZFRTHKRAUFM";
  
  // C# kodundaki sabit tuz değeri (Ivan Medvedev)
  const salt = new Uint8Array([
    0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
  ]);

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  // UTF-16LE kodlaması (C# Encoding.Unicode ile uyumlu)
  const encodeUtf16LE = (text: string): Uint8Array => {
    // C#'daki Encoding.Unicode.GetBytes davranışını tam olarak taklit etme
    const buffer = new ArrayBuffer(text.length * 2);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      view[i * 2] = charCode & 0xFF; // Düşük byte
      view[i * 2 + 1] = charCode >> 8; // Yüksek byte
    }
    return view;
  };

  // UTF-16LE çözümleme
  const decodeUtf16LE = (bytes: Uint8Array): string => {
    let result = '';
    for (let i = 0; i < bytes.length; i += 2) {
      const charCode = bytes[i] | (bytes[i + 1] << 8);
      result += String.fromCharCode(charCode);
    }
    return result;
  };
  
  // PBKDF2 ile anahtar türetme (RFC2898DeriveBytes C# eşdeğeri)
  const deriveKeyAndIV = async (password: string, salt: Uint8Array, keyLength: number, ivLength: number) => {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    try {
      // Web Crypto API kullanarak PBKDF2 ile anahtar türetme
      const baseKey = await crypto.subtle.importKey(
        'raw', 
        passwordData, 
        { name: 'PBKDF2' }, 
        false, 
        ['deriveBits']
      );
      
      // PBKDF2 ile bit türetme (C# Rfc2898DeriveBytes varsayılan olarak 1000 iterasyon ve SHA-1 kullanır)
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 1000,
          hash: 'SHA-1'
        },
        baseKey,
        (keyLength + ivLength) * 8 // Bit cinsinden uzunluk
      );
      
      // Anahtar ve IV ayırma
      const derivedBytes = new Uint8Array(derivedBits);
      const key = derivedBytes.slice(0, keyLength);
      const iv = derivedBytes.slice(keyLength, keyLength + ivLength);
      
      return { key, iv };
    } catch (error: unknown) {
      showToastMessage("Key derivation error: " + (error as Error).message, 'error');
      throw error;
    }
  };

  // AES şifreleme fonksiyonu (C# Encrypt metoduyla uyumlu)
  const encryptText = async () => {
    try {
      setIsLoading(true);
      
      if (!inputText) {
        showToastMessage('Please enter text to encrypt', 'error');
        setIsLoading(false);
        return;
      }

      // UTF-16LE kodlamaya çevirme
      const clearBytes = encodeUtf16LE(inputText);
      
      // Anahtar ve IV türetme
      const { key, iv } = await deriveKeyAndIV(encryptionKey, salt, 32, 16);

      // AES anahtar nesnesi oluşturma
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
      );

      // Şifreleme
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        cryptoKey,
        clearBytes
      );

      // Base64 kodlama
      const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
      setEncryptedText(encryptedBase64);
      setInputText(''); // Clear input after successful encryption
      showToastMessage('Text encrypted successfully', 'success');
      setIsLoading(false);
    } catch (err: unknown) {
      showToastMessage('Encryption failed: ' + (err as Error).message, 'error');
      setIsLoading(false);
    }
  };

  // AES şifre çözme fonksiyonu (C# Decrypt metoduyla uyumlu)
  const decryptText = async () => {
    try {
      setIsLoading(true);
      
      if (!inputText) {
        showToastMessage('Please enter encrypted text', 'error');
        setIsLoading(false);
        return;
      }

      // C#'daki boşlukları + ile değiştirme işlemi
      const fixedInput = inputText.replace(/ /g, '+');
      
      // Base64 çözme
      const cipherBytes = Uint8Array.from(atob(fixedInput), c => c.charCodeAt(0));

      // Anahtar ve IV türetme
      const { key, iv } = await deriveKeyAndIV(encryptionKey, salt, 32, 16);

      // AES anahtar nesnesi oluşturma
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
      );

      // Şifre çözme
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        cryptoKey,
        cipherBytes
      );

      // UTF-16LE çözümleme
      const decryptedBytes = new Uint8Array(decryptedBuffer);
      const result = decodeUtf16LE(decryptedBytes);
      
      setDecryptedText(result);
      setInputText(''); // Clear input after successful decryption
      showToastMessage('Text decrypted successfully', 'success');
      setIsLoading(false);
    } catch (err: unknown) {
      showToastMessage('Decryption failed: ' + (err as Error).message, 'error');
      setIsLoading(false);
    }
  };

  const handleProcess = () => {
    if (mode === 'encrypt') {
      encryptText();
    } else {
      decryptText();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-black mb-2">
            AES Encryption
          </h1>
          <p className="text-gray-500 text-sm">
            Secure encryption and decryption
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full">
            <button 
              onClick={() => setMode('encrypt')} 
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
                mode === 'encrypt' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-600'
              }`}
              disabled={isLoading}
            >
              Encrypt
            </button>
            <button 
              onClick={() => setMode('decrypt')} 
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
                mode === 'decrypt' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-600'
              }`}
              disabled={isLoading}
            >
              Decrypt
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-gray-900 h-5">
              {mode === 'encrypt' ? 'Text to encrypt' : 'Encrypted text'}
            </label>
            <textarea 
              className="w-full px-3 py-3 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none font-mono text-sm"
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter encrypted text...'}
              disabled={isLoading}
            />
          </div>

          <button 
            onClick={handleProcess}
            className="w-full py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </span>
            ) : (
              mode === 'encrypt' ? 'Encrypt' : 'Decrypt'
            )}
          </button>

          <div className="min-h-[140px]">
            {encryptedText && mode === 'encrypt' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">Encrypted Text</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(encryptedText)}
                    className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 break-all font-mono text-xs text-gray-600 max-h-32 overflow-y-auto">
                  {encryptedText}
                </div>
              </div>
            )}

            {decryptedText && mode === 'decrypt' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">Decrypted Text</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(decryptedText)}
                    className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 break-all font-mono text-xs text-gray-600 max-h-32 overflow-y-auto">
                  {decryptedText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg backdrop-blur-md border transition-all duration-300 ${
            toastType === 'success' 
              ? 'bg-green-50/90 border-green-200 text-green-800' 
              : 'bg-red-50/90 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {toastType === 'success' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AESEncryption;