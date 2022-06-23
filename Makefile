run:
	ssh web sudo rm -rf /var/www/html
	ssh web sudo cp -rf ~/web-ui/www /var/www/html
	ssh web sudo chown -R web:web /var/www/html
	ssh web sudo systemctl restart nginx
