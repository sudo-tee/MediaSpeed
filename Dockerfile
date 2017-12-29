FROM mhart/alpine-node:8

RUN mkdir -p /code
RUN mkdir -p /data

ENV DATA_FOLDER /data

VOLUME ["/media", "/data"]

WORKDIR /code
ADD . /code
RUN npm install -g -s --no-progress yarn && \
    yarn && \
    yarn run build && \
    yarn cache clean
CMD [ "yarn", "start" ]
EXPOSE 5000