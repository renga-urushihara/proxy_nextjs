(
    path=$(
        cd $(dirname $0)
        pwd
    )
    docker-compose -f "${path}/docker-compose.yml" up
)
