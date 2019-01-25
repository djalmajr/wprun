#!/usr/bin/env bash

cross-env NODE_ENV=development "$*" webpack-dev-server --mode=development
