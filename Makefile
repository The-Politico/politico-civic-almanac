test:
	pytest -v

ship:
	python setup.py sdist bdist_wheel
	twine upload dist/* --skip-existing

dev:
	gulp --cwd almanac/staticapp/

database:
	dropdb almanac --if-exists
	createdb almanac
