git pull && rm -rf node_module && rm -rf package-lock.json && rm -rf build && npm i && npm run build && sudo rm -rf /var/www/admin/* && sudo cp build/* /var/www/admin -r && sudo service nginx restart
