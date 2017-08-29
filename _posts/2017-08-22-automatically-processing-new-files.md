---
layout: post
title: "Automatically Processing New Files"
author: andrew
tags: [blog]
description: >
---

If you have a project where you need to process files as they are made, you can watch the directory for new files and process them as they appear.  As a basic example, the program below looks at what files are in a directory to start.  If a new file appears in that directory, it moves the file into the folder "processed".  It will just continue to watch and move any new files.



~~~py
    import os
    file_dir = '/path/to/directory/'
    keep_files = os.listdir(file_dir)
    keep_files_len = len(keep_files)

    while True:

        file_list = os.listdir(file_dir)

        if len(file_list) > keep_files_len:

            for file_name in file_list:
                if file_name not in keep_files:
                old_file = file_dir + file_name
                new_file = file_dir + 'processed/' + file_name
                os.system('mv %s %s' % (old_file, new_file))
~~~
