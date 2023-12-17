format:
	poetry run black .
	poetry run ruff --select I --fix .
	poetry run vulture . --exclude=venv

PYTHON_FILES=.
lint: PYTHON_FILES=.
lint_diff: PYTHON_FILES=$(shell git diff --name-only --diff-filter=d master | grep -E '\.py$$')

lint lint_diff:
	poetry run black $(PYTHON_FILES) --check
	poetry run ruff .
	poetry run vulture . --exclude=venv