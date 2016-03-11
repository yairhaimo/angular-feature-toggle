#!/bin/bash

echo "#################################"
echo "#### Update master ##############"
echo "#################################"

ARG_DEFS=(
  "[--no-test=(true|false)]"
)

function init {
  if [[ ! $VERBOSE ]]; then
    VERBOSE=false
  fi
  VERBOSE_ARG="--verbose=$VERBOSE"

  TMP_DIR=../../.tmp
  if [[ -d ${TMP_DIR} ]]; then
    printf '%s\n' "Removing ($TMP_DIR)"
    rm -rf ${TMP_DIR}
  fi
  mkdir ${TMP_DIR}
}

function build {
  cd ../..

  if [[ $NO_TEST == "true" ]]; then
    npm install --color false
    #grunt ci-checks package --no-color
    grunt bower --no-color
  else
    echo "Add test call here."
    # ./jenkins_build.sh
  fi

  cd $SCRIPT_DIR
}

function phase {
  ACTION_ARG="--action=$1"

  #../code.angularjs.org/publish.sh $ACTION_ARG $VERBOSE_ARG
  ../bower/publish.sh $ACTION_ARG $VERBOSE_ARG
}

function run {
  build

  # First prepare all scripts (build, test, commit, tag, ...),
  # so we are sure everything is all right
  phase prepare
  # only then publish to github
  phase publish
}

source $(dirname $0)/../utils.inc
