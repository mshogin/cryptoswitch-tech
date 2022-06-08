GOCMD=$(CURDIR)/cmd

.PHONY: init build clean

all: build

# CryptoSwitch
# WEB
web=35.214.191.249

web-box-create:
	ssh web sudo apt update
	ssh web sudo apt install -y nginx
	ssh web sudo useradd -s /bin/bash -d /home/igor/ -m -G sudo igor
	ssh web sudo useradd -s /bin/bash -m web
	ssh web sudo chown -R web:web /var/www/html
	ssh web sudo chmod -R 0775 /var/www/html
	ssh web sudo usermod -a -G web mshogin
	ssh web sudo usermod -a -G web ikopanev

web-run-dev:
	npm run dev

web-build:
	npm run build

web-deploy: web-build
	/usr/bin/rsync -a ./www/ $(web):/var/www/html/
	sudo systemctl restart nginx

web-deploy-nginx:
	scp sc-web-nginx.conf web:~/
	ssh web sudo cp -f ~/sc-web-nginx.conf /etc/nginx/sites-enabled/
	ssh web sudo systemctl restart nginx.service
