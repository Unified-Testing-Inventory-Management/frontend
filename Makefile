.PHONY: list install run build

list:
	@echo "Available commands:"
	@echo "install  - Install all project dependencies using npm"
	@echo "run      - Run the project in development mode"
	@echo "build    - Build the project for production"

install:
	npm install

run:
	npm run dev

build:
	npm run build