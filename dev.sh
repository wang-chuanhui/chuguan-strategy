rm ../../hass-config/debug/www/community/chuguan-strategy/chuguan-strategy.js.gz
rm ../../hass-config/313/config/www/community/chuguan-strategy/chuguan-strategy.js.gz
echo "build dev"
npm run build-dev
cp ../../hass-config/debug/www/community/chuguan-strategy/chuguan-strategy.js ../../hass-config/313/config/www/community/chuguan-strategy/chuguan-strategy.js
echo "build"
npm run build