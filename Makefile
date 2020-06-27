up:
	docker-compose up
test:
	docker-compose exec admin_web /bin/bash -c "bundle exec rspec"
