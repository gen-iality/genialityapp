devgeniality:
	node --max_old_space_size=8000 node_modules/.bin/vite build --mode geniality_staging

devevius:
	node --max_old_space_size=8000 node_modules/.bin/vite build --mode staging

zip:
	cd dist && zip html.zip * -r

