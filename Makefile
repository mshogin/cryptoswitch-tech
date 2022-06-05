GOCMD=$(CURDIR)/cmd

.PHONY: init build clean

all: build

# CryptoSwitch
# WEB
web=35.214.191.249

web-run-dev:
	npm run dev

web-build:
	npm run build

web-deploy: web-build
	/usr/bin/rsync -a ./www/ web:/var/www/html/
	sudo systemctl restart nginx

# API server
api-run-dev:
	go run cmd/api/main.go

api-setup:
	./scripts/trader-setup.sh

api-deploy:
	scp ../api-server_0.2-0_amd64.deb trader:/home/mshogin/
	ssh trader sudo dpkg -i /home/mshogin/api-server_0.2-0_amd64.deb
	sudo systemctl restart api-server.service

api-deb:
	dpkg-buildpackage -us -uc -b --host-arch amd64

api-clean:
	rm -f cmd/api-server
