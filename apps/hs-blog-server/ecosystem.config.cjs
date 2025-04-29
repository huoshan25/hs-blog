module.exports = {
  apps: [
    {
      name: 'hs-blog-server',
      script: 'dist/main.js',

      instances: 1, // 实例数量
      autorestart: true, // 自动重启
      // 执行模式，cluster 表示多实例共享端口
      exec_mode: 'cluster',

      // 内存使用超过此值时自动重启应用
      max_memory_restart: '2G',

      // 生产环境特定的环境变量
      env_production: {
        NODE_ENV: 'production',
      },
      // 注意: 敏感环境变量不在此处配置，通过 .env.production 文件加载
      // 启动命令: pm2 start ecosystem.config.cjs --env production
    },
  ],
};
