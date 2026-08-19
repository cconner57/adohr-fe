# ==================================================================================== #
# VARIABLES
# ==================================================================================== #
PACKAGE_MANAGER?=npm
WRANGLER_PROJECT?=adohr
PORT?=5173
HOST?=localhost

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## dev: run the Vite development server (alias for run-fe)
.PHONY: dev
dev: run-fe

## run-fe: run the Vue frontend (dev mode)
.PHONY: run-fe
run-fe:
	@echo 'Starting Frontend...'
	$(PACKAGE_MANAGER) run dev -- --host

## dev-local: run the Vite development server on localhost only
.PHONY: dev-local
dev-local:
	@echo 'Starting Frontend (Local Dev)...'
	$(PACKAGE_MANAGER) run dev

## preview: build and preview locally using Wrangler
.PHONY: preview
preview:
	@echo 'Building and starting local preview with Wrangler...'
	$(PACKAGE_MANAGER) run preview

## clean: remove build artifacts, coverage reports, and temp cache files
.PHONY: clean
clean:
	@echo 'Cleaning build artifacts and caches...'
	rm -rf dist coverage test-results playwright-report blob-report node_modules/.tmp .wrangler *.tsbuildinfo

# ==================================================================================== #
# CODE QUALITY & FORMATTING
# ==================================================================================== #

## fmt: format source code with Prettier
.PHONY: fmt
fmt:
	@echo 'Formatting code with Prettier...'
	$(PACKAGE_MANAGER) run format

## format: alias for fmt
.PHONY: format
format: fmt

## lint: run ESLint and auto-fix issues
.PHONY: lint
lint:
	@echo 'Running ESLint (with auto-fix)...'
	$(PACKAGE_MANAGER) run lint

## lint-check: check code with ESLint without fixing
.PHONY: lint-check
lint-check:
	@echo 'Running ESLint check...'
	$(PACKAGE_MANAGER) run lint:check

## lint-style: run Stylelint on CSS and Vue SFC style blocks
.PHONY: lint-style
lint-style:
	@echo 'Running Stylelint...'
	$(PACKAGE_MANAGER) run lint:style

## type-check: run TypeScript type checking via vue-tsc
.PHONY: type-check
type-check:
	@echo 'Running TypeScript type check...'
	$(PACKAGE_MANAGER) run type-check

# ==================================================================================== #
# TESTING & VALIDATION
# ==================================================================================== #

## test: run unit tests in interactive watch mode
.PHONY: test
test:
	$(PACKAGE_MANAGER) run test:unit

## test-unit: run unit tests in interactive watch mode
.PHONY: test-unit
test-unit:
	$(PACKAGE_MANAGER) run test:unit

## test-check: run unit tests once (CI mode)
.PHONY: test-check
test-check:
	@echo 'Running unit tests (CI mode)...'
	$(PACKAGE_MANAGER) run test:check

## test-coverage: run unit tests with coverage report
.PHONY: test-coverage
test-coverage:
	@echo 'Running unit tests with coverage...'
	$(PACKAGE_MANAGER) run test:coverage

## test-e2e: run Playwright end-to-end tests
.PHONY: test-e2e
test-e2e:
	@echo 'Running Playwright E2E tests...'
	$(PACKAGE_MANAGER) run test:e2e

## test-e2e-ui: run Playwright end-to-end tests with UI runner
.PHONY: test-e2e-ui
test-e2e-ui:
	$(PACKAGE_MANAGER) run test:e2e:ui

## test-e2e-headed: run Playwright end-to-end tests in headed browser mode
.PHONY: test-e2e-headed
test-e2e-headed:
	$(PACKAGE_MANAGER) run test:e2e:headed

## check: run full validation suite (type-check, lint, stylelint, unit tests, e2e)
.PHONY: check
check:
	@echo 'Running full validation suite...'
	$(PACKAGE_MANAGER) run check
	@echo '✅ All checks passed!'

# ==================================================================================== #
# BUILD & DEPLOYMENT
# ==================================================================================== #

## build: type-check and build frontend for production
.PHONY: build
build:
	@echo 'Building for production...'
	$(PACKAGE_MANAGER) run build

## build-only: build frontend for production without type-check
.PHONY: build-only
build-only:
	@echo 'Building frontend bundle...'
	$(PACKAGE_MANAGER) run build-only

## deploy: build and deploy to Cloudflare
.PHONY: deploy
deploy:
	@echo '🚀 Deploying to Cloudflare...'
	$(PACKAGE_MANAGER) run deploy
	@echo '✅ Deployment Complete!'

# ==================================================================================== #
# DEPENDENCIES
# ==================================================================================== #

## install: install project dependencies
.PHONY: install
install:
	$(PACKAGE_MANAGER) install

## install-ci: clean install project dependencies (CI mode)
.PHONY: install-ci
install-ci:
	$(PACKAGE_MANAGER) ci
