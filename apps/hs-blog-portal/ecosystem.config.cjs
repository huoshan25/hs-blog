module.exports = {
  apps: [{
    name: 'blog-portal',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',

    env: {
      NODE_ENV: 'production',
      PORT: 6600,
      NEXT_PUBLIC_API_BASE_URL: '',
      NUXT_PUBLIC_SITE_URL: 'https://blog-portal.top'
    },

    instances: 1,                           // 实例数
    autorestart: true,                      // 自动重启
    watch: false,                           // 文件更改监控
    max_memory_restart: '5G',               // 内存限制重启

    // 日志配置
    error_file: 'logs/err.log',            // 错误日志路径
    out_file: 'logs/out.log',              // 输出日志路径
    log_date_format: 'YYYY-MM-DD HH:mm:ss',// 日志日期格式

    // 其他高级配置
    exec_mode: 'cluster',                   // 执行模式：cluster/fork
    increment_var: 'PORT',                  // 为多个实例增加的环境变量
    restart_delay: 4000,                    // 重新启动延迟
    min_uptime: '30s'                       // 最小运行时间
  }]
}