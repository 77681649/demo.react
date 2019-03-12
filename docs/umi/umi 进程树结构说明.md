# umi 进程树结果说明

## umi dev 

main process: cli.js -> scripts/dev.js
fork process: scripts/realDev.js --> umi-build-dev/lib/Service
              
## umi build

main process: cli.js -> scripts/build.js --> umi-build-dev/lib/Service