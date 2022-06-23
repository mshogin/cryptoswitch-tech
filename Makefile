web-deploy:
	/usr/bin/rsync -a ./www/ cryptoswitch.tech:~/html
	ssh cryptoswitch.tech sudo rm -rf /var/www/html
	ssh cryptoswitch.tech sudo cp -rf ~/html /var/www/html
	ssh cryptoswitch.tech sudo chown -R web:web /var/www/html
	ssh cryptoswitch.tech sudo systemctl restart nginx
