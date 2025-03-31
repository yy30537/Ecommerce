@echo off
echo === 珠宝电商产品管理工具 ===
echo.
echo 请选择操作:
echo 1. 清空并添加新商品
echo 2. 添加商品（不清空现有商品）
echo 3. 更新商品标签
echo 4. 执行所有操作（清空并添加新商品+设置标签）
echo.
set /p choice="请输入选项号码 (1-4): "

if "%choice%"=="1" (
  echo 正在清空数据库并添加新商品...
  npx ts-node -P tsconfig.json scripts/products-manager.ts reset
) else if "%choice%"=="2" (
  echo 正在添加新商品...
  npx ts-node -P tsconfig.json scripts/products-manager.ts add
) else if "%choice%"=="3" (
  echo 正在更新商品标签...
  npx ts-node -P tsconfig.json scripts/products-manager.ts tag
) else if "%choice%"=="4" (
  echo 正在执行完整操作...
  npx ts-node -P tsconfig.json scripts/products-manager.ts reset
  npx ts-node -P tsconfig.json scripts/products-manager.ts tag
) else (
  echo 无效选项，请输入1-4之间的数字。
  goto end
)

:end
pause 