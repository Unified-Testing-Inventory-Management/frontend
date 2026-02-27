.PHONY: list install run build

list:
	@echo "Available commands:"
	@echo "install  - Install all project dependencies using npm"
	@echo "run      - Run the project in development mode"
	@echo "build    - Build the project for production"

install:
	pnpm install

run:
	pnpm run dev

build:
	pnpm run build