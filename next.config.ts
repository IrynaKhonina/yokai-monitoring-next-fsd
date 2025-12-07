/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    serverExternalPackages: [], // было: experimental.serverComponentsExternalPackages


    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig