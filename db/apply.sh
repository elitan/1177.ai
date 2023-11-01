atlas schema apply \
  -u "postgres://postgres:password@ai:9005/postgres?sslmode=disable" \
  --to file://schema.sql \
  --dev-url "docker://postgres/15/test" \