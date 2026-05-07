#!/usr/bin/env bash

tofu output -json | jq -r '
to_entries[] | "\(.key | ascii_upcase)=\(.value.value)"
' > .env.dev
