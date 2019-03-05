help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

docker-start-local: ## to run local server by docker
	$(MAKE) local


install: ## to package provisioning
	@yarn global add pm2 serverless && yarn install


deploy: ## to deploy aws
	@yarn deploy


local: ## to run server at local machine
	@yarn local


offline: ## to run serverless offline mode
	@yarn offline


docker-rebuild: ## rebuild local docker image
	@docker-compose build


docker-e2e: ## docker e2e for local
	@docker-compose -f ./docker-compose.cypress.yml up --force-recreate --build

