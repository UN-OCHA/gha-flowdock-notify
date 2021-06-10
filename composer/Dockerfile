FROM ghcr.io/mileschou/composer:7.3-v1

LABEL org.opencontainers.image.source="https://github.com/UN-OCHA/actions" \
    repository="https://github.com/Un-OCHA/actions" \
    maintainer="OCHA OPS <ops@reliefweb.int>"

RUN set -xe && \
    apk add --no-cache --virtual .build-deps \
      libpng-dev \
      libzip-dev \
      zlib-dev \
    ; \
    docker-php-ext-install -j "$(nproc)" \
      gd zip \
    ; \
    runDeps="$( \
      scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
        | tr ',' '\n' \
        | sort -u \
        | awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
      )"; \
    apk add --no-cache --virtual .composer-phpext-rundeps $runDeps; \
    apk add --no-cache patch; \
    apk del .build-deps
