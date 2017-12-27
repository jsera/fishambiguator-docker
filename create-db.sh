if [ $(uname) == 'Darwin' ]; then
    echo "Creating DB on OSX"
    psql postgres -c "CREATE DATABASE fishambiguator"
elif [ $(uname) == 'Linux' ]; then
    echo "Creating DB on Linux"
    sudo -u postgres psql -c "CREATE DATABASE fishambiguator"
fi
