
all: clean build copy reload

copy:
	cp -r manifest.json view/public/* out/

build:
	yarn build || exit 1

clean:
	rm -rf out out.* email-auto-forward.* view/public/dist

reload:
	open -a '/Applications/Google Chrome.app' 'http://reload.extensions'

crx: clean build copy
	/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./out
	mv out.crx email-auto-forward.crx
	mv out.pem email-auto-forward.pem

zip: clean build copy
	cp -r out email-auto-forward
	zip -vr email-auto-forward.zip email-auto-forward/
	rm -r email-auto-forward
