init:
	docker compose up --build -d

down: 
	docker compose down --volumes --remove-orphans
	
install:
	docker compose exec app npm install