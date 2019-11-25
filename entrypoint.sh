#!/bin/bash

# Enable globstar in patterns
shopt -s globstar

version="$1"
project_root_dir="$2"
pattern="$3"

formatter_jar_name=formatter.jar

function download_formatter() {
  local jar_name=$1
  local version=$2
  local url="https://repo.maven.apache.org/maven2/com/google/googlejavaformat/google-java-format/$version/google-java-format-$version-all-deps.jar"
  echo "Downloading formatter from $url"
  curl -Lo "$jar_name" "$url" 2> /dev/null

  if [ "$?" != "0" ]; then
    echo "Failed to load google java formater version $version from maven central (url see above)."
    return 1
  fi
  return 0
}

function check_formatting() {
  local jar_name="$1"
  local pattern="$2"

  echo 'Checking format'
  java -jar "$jar_name" --dry-run --set-exit-if-changed $2

  local rc=$?
  [ "$rc" == "0" ] &&
    echo 'All files are well formatted' ||
    printf "\nERROR: Some files are not well formatted. The file list above shows all files containing a wrong formatting.\n"

  return "$rc"
}

cd "$project_root_dir"

download_formatter "$formatter_jar_name" "$version"
[ "$?" != "0" ] && exit $?
check_formatting "$formatter_jar_name" "$pattern"
exit $?
