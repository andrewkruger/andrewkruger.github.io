---
layout: post
title: "Putting Your .bash_profile To Work"
author: andrew
tags: [blog]
description: >
---


I'm going to show you how to use bash scripts to create custom git commands and shortcuts.  This also demonstrates how to create and use bash scripts so you make make your own custom scripts and functions for other projects.

<br>

## Exports

The .bash_profile file is located in your home directory and is used to configure your bash shell.  In that file, you can create aliases, shortcut commands, and functions that you can use in the command line or even in your python program.  For the following terminal commands, be in the home directory.  Print out the content in the .bash_profile file and you will probably see some exports, aliases, and/or settings.

~~~sh
    $ cd ~
    $ cat .bash_profile
      # Setting PATH for Python 3.6
      # The orginal version is saved in .bash_profile.pysave
      PATH="/Library/Frameworks/Python.framework/Versions/3.6/bin:${PATH}"
      export PATH

      # added by Anaconda3 4.1.1 installer
      export PATH="/Users/andrew/anaconda/bin:$PATH"
        ...
~~~

The "export" creates an environment variable that can be used by other processes.  An example of an environment variable is `$HOME`.  You can use the command `echo` to view your `$HOME` variable:

~~~sh
    $ echo $HOME
      /Users/andrew
~~~

You can create new environment variables by putting them into the .bash_profile file.  For example, the line `export MY_NAME="andrew-kruger"` will create the variable `$MY_NAME` that's available to other processes.  If you've added an environment variable, you need to source the file for it to be available.

~~~sh
    $ source .bash_profile
    $ echo $MY_NAME
      andrew-kruger
~~~

You can also use this environment variable in python.

~~~python
    >>>> import os
    >>>> os.environ['MY_NAME']
        'andrew-kruger'
~~~


<br>

## Shell Scripts

A shell script is a file that contains commands just like .bash_profile.  Rather than editing .bash_profile with the functions below, let's instead create a file called git_scripts.sh so we can keep .bash_profile clean.

~~~sh
    $ touch git_scripts.sh
~~~

At the bottom of .bash_profile, we can write the line `source $HOME/git_scripts.sh`.  If you want to keep git_scripts.sh in another directory, you need to replace `$HOME` with that directory path.  Now when .bash_profile is sourced, so will our git_scripts.sh.  To test that this is working you can add the line `echo "git_scripts.sh has been sourced!"` to git_scripts.sh, and you should see the following:

~~~sh
    $ source .bash_profile
      git_scripts.sh has been sourced!
~~~

Now that we know it's working, remove the `echo` line in git_scripts.sh.


<br>

## Aliases

An alias is a shortcut for a longer command.  As an example, the command `jupyter notebook` will open a Jupyter Notebook.  If you frequently open notebooks, you can create a shortcut with the line `alias jn="jupyter notebook"`, and it will let you open a notebook by simply typing `jn` (thanks Seth!)

You can also use an alias to run a string of commands.  Let's say that every morning you need to pull changes from a github repository with the commands:

~~~sh
    $ git checkout master
    $ git pull
    $ git checkout andrew-kruger
    $ git merge master
~~~

You can use `alias gpull="git checkout master & git pull & git checkout andrew-kruger & git merge master"`.  Then to update the local repo you can just use

~~~sh
    $ gpull
~~~

The `&` is a list construct that separates the commands and continues after each successive command is executed.  If an error occurs, it will stop the string of commands.  If you want the string of commands to continue even if there is an error, use `&&` instead, and it will execute the first command with an error last.


<br>

## Functions and Parameters

Bash scripts can have functions in which are a list of commands.  The shortcut `gpull` above would look more clean in a function:

~~~
    function gpull(){
        git checkout master
        git pull
        git checkout andrew-kruger
        git merge master
        git branch
    }
~~~

Functions can also take in parameters.  For example, to push changes to your local repository to github, you would use the commands

~~~sh
    $ git add .
    $ git commit -m "edit comments"
    $ git push
~~~

You can create a function that does all three commands (like an alias) but takes in an parameter to use for the commit message.  In the git_scripts.sh file, you can write the function

~~~
    function gpush(){
        git add .
        git commit -m "$1"
        git push
    }
~~~

The `$1` takes the first argument you use with `gpush`.  This means you can now use the command

~~~sh
    $ gpush "edit comments"
~~~

and the "edit comments" will be used as the commit comment.  If you want more parameters, you just iterate the numbers.  For example, the following would create a function that would switch two files.

~~~
    function switch(){
        mv $1 $1.backup
        mv $2 $1
        mv $1.backup $2
    }
~~~

Then to switch two filenames, you can just use

~~~sh
    $ switch filename1 filename2
~~~


<br>

## Optional Parameters

A function can have an optional variable with a default value.  For example, the function `gpush` above takes in a message parameter, but you can make it optional by

~~~
    function gpush(){
        git add .
        git commit -m {1:-"default comment"}
        git push
    }
~~~

With this, you can still add a comment to the commit by `gpush "edit comments"`, but using just the command `gpush` by itself is equivalent to `gpush "default comment"`.  This way you have the option to just use a default comment or put in a new comment if needed.

You can also make two optional parameters, one for the filename of the file you want to push and the second for the comment.

~~~
    function gpush(){ 
        ARG1=${1:-.}
        ARG2=${2:-"default comment"}
        git add $ARG1
        git commit -m "$ARG2"
        git push
    }
~~~

In order to files, you can the commands `gpush`, or `gpush filename "commit comment"`, or `gpush filename`. But you can *not* use `gpush "commit comment"` because it will interpret the `"commit comment"` as the first parameter and use it as `ARG1`.  So you need to remember the order of parameters and know which you need.


<br>

## If Statements

Another option is to use a flag for which parameters the inputs are for.  For example, it would be nice to be able to use `gpush "commit comment"` for when you want to do all files, and `gpush filename "commit comment"` when you want to push a specific file.  To do this, we can see how many parameters there are with `$#`, and then decide what to do with the arguments based on how many there are.

Looking at the following function:

~~~
    function gpush(){
        if [ $# -gt 1 ]
            then
                ARG1=$1
                ARG2=$2
            else
                ARG1=.
                ARG2=${1:-"default comment"}
        fi
        git add $ARG1
        git commit -m "$ARG2"
        git push
    }
~~~

The `if [ $# -gt 1 ]` sees if there are more than one parameter (the count of parameters is given by `$#`).  If there are, it uses `ARG1` as the filename, and `ARG2` as the commit comment.  If there aren't more than two parameters, it makes `ARG1=.` to push all files.  It then makes `ARG2` an optional parameter like before, where if there is a parameter, it will use it as the commit comment, otherwise it usees "default comment".  The `fi` closes out the `if` statement.

Now you can use the following commands.  To push a specific file with a specific comment:

~~~sh
    $ gpush filename.ext "Here's my specific comment"
~~~

To push all files with a specific comment:

~~~sh
    $ gpush "Here's my specific comment"
~~~

To push all files with a default comment:

~~~sh
    $ gpush
~~~




