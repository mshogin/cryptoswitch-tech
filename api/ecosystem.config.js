module.exports = {
    apps : [
        {
            name: "cs-api",
            script: "./bin/www",
            watch: true,
            env: {
                "PORT": 3000,
                "NODE_ENV": "development",
                "DB_HOST": "localhost",
                "DB_PASSWORD": "gct"
            },
            env_prod: {
                "PORT": 3000,
                "NODE_ENV": "production",
                "DB_HOST": "localhost",
                "DB_PASSWORD": "gct"
            }
        }
    ]
}
