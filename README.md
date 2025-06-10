# AES Encryption Tool

A modern, secure AES encryption and decryption tool built with Next.js and TypeScript. Features an Apple-inspired design and C# compatibility.

## 🔒 Features

- **AES-256-CBC Encryption**: Industry-standard encryption algorithm
- **PBKDF2 Key Derivation**: Secure key generation with 1000 iterations
- **C# Compatibility**: Compatible with C# AES implementations
- **Apple-Style Design**: Clean, minimal, and elegant user interface
- **Real-time Processing**: Instant encryption and decryption
- **Copy to Clipboard**: Easy copying of encrypted/decrypted text
- **Toast Notifications**: User-friendly feedback system
- **Progressive Web App**: Installable as a mobile app
- **SEO Optimized**: Complete meta tags and structured data

## 🛡️ Security Features

- Environment variable key management
- Client-side processing (no data sent to servers)
- UTF-16LE encoding for C# compatibility
- PBKDF2 key derivation with salt
- Secure cryptographic operations using Web Crypto API

## 🚀 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Web Crypto API** - Cryptographic operations

## 📱 Installation

1. Clone the repository:
```bash
git clone https://github.com/alicanbasak/aes-encryption-app.git
cd aes-encryption-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file with your encryption settings:

```bash
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key-here
NEXT_PUBLIC_SALT=Ivan Medvedev
```

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 🌐 Deployment

This project is optimized for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting**

## 🔐 C# Compatibility

This tool is designed to be compatible with C# AES implementations using:

- `Encoding.Unicode` (UTF-16LE)
- `Rfc2898DeriveBytes` with 1000 iterations
- `AesCryptoServiceProvider` with CBC mode
- Same salt and key values

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔍 SEO & Performance

- Complete meta tags and Open Graph data
- Structured data (JSON-LD)
- Progressive Web App manifest
- Optimized images and icons
- Fast loading with Next.js optimization

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/alicanbasak/aes-encryption-app/issues).

---

Made with ❤️ for secure communication