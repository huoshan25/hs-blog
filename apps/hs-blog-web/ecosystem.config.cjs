module.exports = {
  apps: [{
    name: 'hs-blog-web',                        // 应用名称
    script: '.output/server/index.mjs',     // 启动脚本路径

    // 环境变量配置
    env: {
      NODE_ENV: 'production',
      NITRO_PORT: 7788,
    },
    // 注意: 敏感环境变量不在此处配置，通过 .env.production 文件加载
    // 启动命令: pm2 start ecosystem.config.cjs --env production

    // 进程配置
    instances: 1,                           // 实例数量
    autorestart: true,                      // 自动重启
    watch: false,                           // 文件变化监控
    max_memory_restart: '4',               // 内存超限重启

    // 日志配置
    error_file: 'logs/err.log',            // 错误日志路径
    out_file: 'logs/out.log',              // 输出日志路径
    log_type: 'json',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_logs: 20,           // 保留20个日志文件
    log_file: 'logs/combined.log',

    // 其他高级配置
    exec_mode: 'cluster',                   // 执行模式：cluster/fork
    increment_var : 'PORT',                 // 多实例时递增的环境变量
    restart_delay: 4000,                    // 重启延迟
    min_uptime: '30s'                       // 最小运行时间
  }]
}