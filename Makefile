source = passwordStrength.js
minified = passwordStrength.min.js

minify:
	@echo "> Minifying..."
	@rm -f $(minified)
	@curl -s \
		-X POST \
		--data-urlencode 'compilation_level=SIMPLE_OPTIMIZATIONS' \
		--data-urlencode 'output_format=text' \
		--data-urlencode 'output_info=compiled_code' \
		--data-urlencode 'js_code@$(source)' \
		-o $(minified) \
		http://closure-compiler.appspot.com/compile

.PHONY: minify
