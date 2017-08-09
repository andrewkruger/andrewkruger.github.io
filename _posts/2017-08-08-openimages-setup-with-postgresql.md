---
layout: post
title: "OpenImages Setup with PostgreSQL"
author: andrew
tags: [blog]
description: >
---


OpenImages is a database of images that can be used to train and test machine learning and neural network object recognition algorithms.  It has URLs of 9 million images with labeled objects, both by humans and object recognition software.  While there are some instructions of how to download and organize the database in PostgreSQL, they are based on earlier datasets and there are mistakes.  The following is an updated outline, as well as further instructions on how to query the database to retrieve images that match the needs of a project.


## Download the Data

The current data can be downloaded by the following:

~~~sh
    cd ~
    mkdir openimages
    cd openimages
    wget "https://storage.googleapis.com/openimages/2017_07/images_2017_07.tar.gz"
    wget "https://storage.googleapis.com/openimages/2017_07/annotations_human_bbox_2017_07.tar.gz"
    wget "https://storage.googleapis.com/openimages/2017_07/annotations_human_2017_07.tar.gz"
    wget "https://storage.googleapis.com/openimages/2017_07/annotations_machine_2017_07.tar.gz"
    wget "https://storage.googleapis.com/openimages/2017_07/classes_2017_07.tar.gz"
~~~

Unfortunately, when you untar these files, they will all create the same folder `2017_07`.  The following will keep the directories separate:

~~~sh
    tar -xvzf images_2017_07.tar.gz
    mv 2017_07 images_2017_07
    tar -xvzf annotations_human_bbox_2017_07.tar.gz
    mv 2017_07 annotations_human_bbox_2017_07
    tar -xvzf annotations_human_2017_07.tar.gz
    mv 2017_07 annotations_human_2017_07
    tar -xvzf annotations_machine_2017_07.tar.gz
    mv 2017_07 annotations_machine_2017_07
    tar -xvzf classes_2017_07.tar.gz
    mv 2017_07 classes_2017_07
    rm *.tar.gz
~~~
    
In each of the folders `annotations_human_2017_07`, `annotations_human_bbox_2017_07`, `annotations_machine_2017_07`, and `images_2017_07`, there are three folders: `test`, `train`, and `validation`.  These three folders contain a list of images, including 1) the `ImageID` (unique to that image), 2) the `Source` of who identified the object (*human* or *machine*), 3) the `LabelName` which is a unique identifier for each object (i.e. /m/0cmf2 is an Airplane), 4) and the `Confidence` which is the probability of the label classification being correct.

## Create the PostgreSQL Tables

After starting PostgreSQL from the terminal by the command `psql`, the terminal should show the username and look something like:

~~~sql
    andrew=#
~~~

A database can be created to contain the OpenImages database, which we'll call `openimages` by:

~~~sql
    andrew=# CREATE DATABASE openimages;
~~~

If you enter `\l`, you should see that the database `openimages` now exists.  You can connect to the database by:

~~~sql
    andrew=# \c openimages
    openimages=#
~~~

The terminal prompt should change to `openimages=#`, which shows you are now in the `openimages` database.  


Next, create the tables.  First, a table for the image metadata:

~~~sql
    CREATE TABLE Images (
        ImageID CHAR(16),
        Subset VARCHAR,
        OriginalURL VARCHAR,
        OriginalLandingURL VARCHAR,
        License VARCHAR,
        AuthorProfileURL VARCHAR,
        Author VARCHAR,
        Title VARCHAR,
        OriginalSize BIGINT,
        OriginalMD5 VARCHAR,
        Thumbnail300KURL VARCHAR,
        PRIMARY KEY(ImageID)
    );
~~~

A table for labels:

~~~sql
    CREATE TABLE Labels (
        ImageID CHAR(16) REFERENCES Images(ImageID),
        Source VARCHAR,
        LabelName VARCHAR REFERENCES Dict(LabelName),
        Confidence REAL,
        PRIMARY KEY(ImageID, Source, LabelName)
    );
~~~

Finally, a table to map the `LabelName` to a display name that is a description of the label:

~~~sql
    CREATE TABLE Dict (
        LabelName VARCHAR,
        DisplayLabelName VARCHAR,
        PRIMARY KEY (LabelName)
    );
~~~

## Uploading the Data

Upload the image metadata into the `Images` table:

~~~sql
    \COPY Images FROM 'images_2017_07/train/images.csv' DELIMITER ',' CSV HEADER;
    \COPY Images FROM 'images_2017_07/validation/images.csv' DELIMITER ',' CSV HEADER;
~~~

Upload the image metadata into the `Labels` table:

~~~sql
    \COPY Labels FROM 'annotations_human_2017_07/train/annotations-human.csv' DELIMITER ',' CSV HEADER;
    \COPY Labels FROM 'annotations_human_2017_07/test/annotations-human.csv' DELIMITER ',' CSV HEADER;
    \COPY Labels FROM 'annotations_human_2017_07/validation/annotations-human.csv' DELIMITER ',' CSV HEADER;
    \COPY Labels FROM 'annotations_machine_2017_07/train/annotations-machine.csv' DELIMITER ',' CSV HEADER;
    \COPY Labels FROM 'annotations_machine_2017_07/test/annotations-machine.csv' DELIMITER ',' CSV HEADER;
    \COPY Labels FROM 'annotations_machine_2017_07/validation/annotations-machine.csv' DELIMITER ',' CSV HEADER;
~~~

Upload the label name descriptions:

~~~sql
    \COPY Dict FROM 'classes_2017_07/class-descriptions.csv' DELIMITER ',' CSV HEADER;
~~~


## Query the Data

Let's look at example data for each of the tables.  First, let's look at labels.

~~~sql
    openimages=# SELECT * FROM Images LIMIT 5;

    imageid          | source | labelname  | confidence 
    -----------------+--------+------------+------------
    01b3e1bcccb2ba06 | human  | /m/02jq33  |          0
    01b3e1bcccb2ba06 | human  | /m/02kvytt |          0
    01b3e1bcccb2ba06 | human  | /m/047fr   |          0
    01b3e1bcccb2ba06 | human  | /m/09kxp   |          1
    01b3e1bcccb2ba06 | human  | /m/0chlrk  |          0
    (5 rows)
~~~

However, let's limit to positively identified objects by limiting to rows where the confidence is 1.

~~~sql
    openimages=# SELECT * FROM Images WHERE Labels.Confidence = 1 LIMIT 5;

    imageid          | source | labelname | confidence 
    -----------------+--------+-----------+------------
    34d98b4630321574 | human  | /m/04f4xh |          1
    34d98b4630321574 | human  | /m/07yv9  |          1
    34d98b4630321574 | human  | /m/083wq  |          1
    34d98b4630321574 | human  | /m/0k4j   |          1
    34d9993e9dae832c | human  | /m/01d40f |          1
    (5 rows)
~~~

Same for the label descriptions:

~~~sql
    openimages=# SELECT * FROM Dict LIMIT 5;

    labelname   |  displaylabelname   
    ------------+---------------------
    /m/0100nhbf | Sprenger``'``s tulip
    /m/0104x9kv | Vinegret
    /m/0105jzwx | Dabu-dabu
    /m/0105ld7g | Pistachio ice cream
    /m/0105lxy5 | Woku
    (5 rows)
~~~


For the images, the rows are wide with many columns, so turn on the extended display to make it readable.

~~~sql
    openimages=# \x on
    openimages=# SELECT * FROM Images LIMIT 1;

    -[ RECORD 1 ]------+----------------------------------------------------------------
    imageid            | 0001eeaf4aed83f9
    subset             | validation
    originalurl        | https://c2.staticflickr.com/6/5606/15611395595_f51465687d_o.jpg
    originallandingurl | https://www.flickr.com/photos/hisgett/15611395595
    license            | https://creativecommons.org/licenses/by/2.0/
    authorprofileurl   | https://www.flickr.com/people/hisgett/
    author             | Tony Hisgett
    title              | American Airlines Boeing 777-323(ER) N717AN
    originalsize       | 2038323
    originalmd5        | I4V4qq54NBEFDwBqPYCkDA==
    thumbnail300kurl   | https://c4.staticflickr.com/6/5606/15611395595_0594841ba5_z.jpg

    openimages=# \x off
~~~

If we want to find a specific type of object, we can look for the label names that match the object.  For example, if you want pictures of hands:

~~~sql
    openimages=# SELECT * FROM dict WHERE DisplayLabelName LIKE 'Hand';

    labelname | displaylabelname 
    ----------+------------------
    /m/0k65p  | Hand
    (1 row)
~~~

If we want things that include the word "hand", we can use the `%` operator:


~~~sql
    openimages=# SELECT * FROM dict WHERE DisplayLabelName LIKE '%hand%' LIMIT 5;

    labelname  | displaylabelname  
    -----------+-------------------
    /m/01613k  | Holding hands
    /m/026p7j9 | Beach handball
    /m/027jy5t | Field handball
    /m/02rqv26 | Bicycle handlebar
    /m/02ws6z  | Chandelier
    (5 rows)
~~~

If we want it to start with "Hand", don't use `%` at the beginning.

~~~sh
    openimages=# SELECT * FROM Dict WHERE DisplayLabelName LIKE 'Hand%' LIMIT 5;

    labelname | displaylabelname 
    ----------+------------------
    /m/016133 | Handshake
    /m/016h1k | Handcuffs
    /m/01nh1r | Handkerchief
    /m/01w1x1 | Hand drum
    /m/01yc83 | Hand tool
    (5 rows)
~~~


Let's say you want pictures that have hands, we can search for images with the `LabelName` for "Hand" shown above (/m/0k65p).

~~~sql
    openimages=# SELECT * FROM Labels WHERE LabelName='/m/0k65p' LIMIT 5;

    imageid          | source | labelname | confidence 
    -----------------+--------+-----------+------------
    000a1249af2bc5f0 | human  | /m/0k65p  |          1
    0010c714a5da358a | human  | /m/0k65p  |          0
    00141571d986d241 | human  | /m/0k65p  |          1
    001464cfae2a30b8 | human  | /m/0k65p  |          0
    00146ba1e50ed8d8 | human  | /m/0k65p  |          1
    (5 rows)
~~~

It would be better to get the actual URLS for the images (`OriginalLandingURL`).  To do this, we need to join the `Images` with `Labels`


~~~sql
    openimages=# SELECT originalurl FROM Labels
            INNER JOIN Images ON Labels.ImageID = Images.ImageID
            WHERE LabelName='/m/0k65p' LIMIT 5;

    originalurl                           
    -----------------------------------------------------------------
    https://farm1.staticflickr.com/8087/8563450894_8f2fda7196_o.jpg
    https://c3.staticflickr.com/4/3022/2623344128_4aaa8fc178_o.jpg
    https://farm2.staticflickr.com/2603/3692981083_34b1710067_o.jpg
    https://c1.staticflickr.com/9/8292/7859745110_b8c1401cd9_o.jpg
    https://c1.staticflickr.com/8/7517/16104664631_c8bdf2a7ff_o.jpg
    (5 rows)
~~~

The first URL is to the image:

<p align="center">
<img src="https://c1.staticflickr.com/9/8087/8563450894_0b57eb01b3_z.jpg" alt="Field"/>
</p>

So this database can be used to get a list of URLs of objects to use for training object recognition algorithms.

