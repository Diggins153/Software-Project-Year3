const { devDependencies } = require("./package.json");

// Build up your externals object from devDependencies (only for the server build).
const externals = {};
for (const devDependency of Object.keys(devDependencies)) {
    externals[devDependency] = `commonjs ${ devDependency }`;
}

// Externalize all MikroORM modules
externals["@mikro-orm/core"] = "commonjs @mikro-orm/core";
externals["@mikro-orm/mysql"] = "commonjs @mikro-orm/mysql";
externals["@mikro-orm/migrations"] = "commonjs @mikro-orm/migrations";
externals["@mikro-orm/reflection"] = "commonjs @mikro-orm/reflection";
externals["@mikro-orm/seeder"] = "commonjs @mikro-orm/seeder";

// Externalize knex
externals["knex"] = "commonjs knex";

/** @type import("next").NextConfig */
module.exports = {
    experimental: {
        turbo: {},
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
