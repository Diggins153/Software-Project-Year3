const path = require("path");
const { IgnorePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { devDependencies } = require("./package.json");

// Build up your externals object from devDependencies (only for the server build).
const externals = {};
for (const devDependency of Object.keys(devDependencies)) {
    externals[devDependency] = `commonjs ${ devDependency }`;
}

// Optional: Add any optional modules that you want to be externalized
const optionalModules = new Set([
    ...Object.keys(require("knex/package.json").browser),
    ...Object.keys(require("@mikro-orm/knex/package.json").dependencies),
    ...Object.keys(
        require("@mikro-orm/core/package.json").peerDependencies || {},
    ),
    ...Object.keys(require("@mikro-orm/core/package.json").devDependencies || {}),
]);

// Externalize all MikroORM modules
externals["@mikro-orm/core"] = "commonjs @mikro-orm/core";
externals["@mikro-orm/mysql"] = "commonjs @mikro-orm/mysql";
externals["@mikro-orm/migrations"] = "commonjs @mikro-orm/migrations";
externals["@mikro-orm/reflection"] = "commonjs @mikro-orm/reflection";
externals["@mikro-orm/seeder"] = "commonjs @mikro-orm/seeder";
externals["@mikro-orm/knex"] = "commonjs @mikro-orm/knex";

// Externalize knex
externals["knex"] = "commonjs knex";

/** @type {import("next").NextConfig} */
module.exports = {
    experimental: {
        turbo: {},
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placehold.co",
                port: "",
                search: "",
                pathname: "**",
            },
        ],
    },
    webpack: (config, { isServer, webpack }) => {
        //
        // 1) Externals (only do this on the server build)
        //
        if (isServer) {
            config.externals = [
                ...(config.externals || []),
                function ({ request }, callback) {
                    if (externals[request]) {
                        return callback(null, externals[request]);
                    }
                    callback();
                },
            ];
        }

        config.plugins.push(new webpack.EnvironmentPlugin({ WEBPACK: true }));

        // IgnorePlugin
        config.plugins.push(
            new IgnorePlugin({
                checkResource: (resource) => {
                    const baseResource = resource
                        .split("/", resource[0] === "@" ? 2 : 1)
                        .join("/");
                    if (optionalModules.has(baseResource)) {
                        try {
                            require.resolve(resource);
                            return false;
                        } catch {
                            return true;
                        }
                    }
                    return false;
                },
            }),
        );

        // TerserPlugin
        if (!config.optimization) {
            config.optimization = {};
        }
        config.optimization.minimizer = config.optimization.minimizer || [];
        config.optimization.minimizer = [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,
                    compress: {
                        keep_classnames: true,
                        keep_fnames: true,
                    },
                },
            }),
        ];

        //
        // 4) Custom module rules
        //
        config.module.rules.push(
            {
                test: /\.node$/,
                use: "node-loader",
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto",
            },
        );

        // Return the modified config to Next
        return config;
    },
};
