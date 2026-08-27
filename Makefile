.DEFAULT_GOAL := help

APPS := app api web card

.PHONY: help start $(APPS)

help:
	@echo "Usage:"
	@echo "  make start APP=<app>  Start a selected application"
	@echo "  make <app>            Start an application directly"
	@echo ""
	@echo "Available applications: $(APPS)"

start:
	@if [ -z "$(APP)" ]; then \
		echo "APP is required. Choose one of: $(APPS)"; \
		exit 1; \
	fi
	@if ! echo " $(APPS) " | grep -q " $(APP) "; then \
		echo "Unknown application '$(APP)'. Choose one of: $(APPS)"; \
		exit 1; \
	fi
	@$(MAKE) --no-print-directory "$(APP)"

app:
	pnpm --dir app dev

api:
	npm --prefix api run dev

web:
	npm --prefix web run dev

card:
	npm --prefix card run dev
