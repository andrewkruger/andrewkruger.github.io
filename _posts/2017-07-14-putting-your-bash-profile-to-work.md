---
layout: post
title: "bash"
author: andrew
tags: [blog]
description: >
---

The .bash_profile file is located in your home directory and is used to configure your shell.  In there, you can create aliases, shortcut commands, and functions to use in the command line or your python program.  For the following terminal commands, be in the home directory.  Print out in the .bash_profile file and you will probably see some exports, or aliases, or settings being made.

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

The "export" creates an environment variable that can be used by other processes.  An example of an environment variable is `$HOME`.  You can use the command `sh -c` to view your HOME variable:

~~~sh
    $ sh -c 'echo $HOME'
      /Users/andrew
~~~

You can create new environment variables by putting them into the .bash_profile file.  For example, the line `export MY_NAME="andrew-kruger"` will create the variable `MY_NAME` that's available to other processes.  If you've added an environment variable, you need to source the file for it to be available.

~~~sh
    $ source .bash_profile
    $ sh -c 'echo $MY_NAME'
      andrew-kruger
~~~

You can now use this variable in your python scripts.

~~~python
    >>>> import os
    >>>> os.environ['MY_NAME']
        'andrew-kruger'
~~~


