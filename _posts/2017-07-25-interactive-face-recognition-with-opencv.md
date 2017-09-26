---
layout: post
title: "Interactive Face Recognition with OpenCV"
author: andrew
tags: [blog]
description: >
---


## OpenCV, PyImageSearch, and Facial Landmark Detection

[OpenCV](http://opencv.org/) is a computer vision library for Python, C++, C, and Java that is commonly used in data science when working with images.  People have created great tutorials and supporting programs, for example [PyImageSearch](http://www.pyimagesearch.com/).  PyImageSearch has a [facial landmark detector](http://www.pyimagesearch.com/2017/04/17/real-time-facial-landmark-detection-opencv-python-dlib/) for Python that doesn't just do facial recognition, but identifies the location and shape of the parts of the face.  This enables us to do some fun things.



The landmarks are indicated with red dots:

<p align="center">
<iframe src='https://gfycat.com/ifr/RegularDefinitiveAntlion' frameborder='0' scrolling='no' width='600' height='330' allowfullscreen></iframe>
</p>


The landmarks can be used to track specific parts of the face.  Here I'm only showing the eye landmarks:




<p align="center">
<iframe src='https://gfycat.com/ifr/IncompleteYellowishDog' frameborder='0' scrolling='no' width='600' height='330' allowfullscreen></iframe>
</p>


This allowed me to track the eyes.  I took the average of the left and right eye landmarks to get the positions of the center of the eyes. 

Next, we can do image manipulation in OpenCV.  We can [rotate, move, and resize images](http://www.pyimagesearch.com/2017/01/02/rotate-images-correctly-with-opencv-and-python/), as well as [detect colors and mask them](http://www.pyimagesearch.com/2014/08/04/opencv-python-color-detection/).  With the masking, we can overlay images that we've manipulated.  Starting with an image of ["deal with it" glasses](https://www.google.com/search?rlz=1C5CHFA_enUS567US569&biw=1215&bih=579&tbm=isch&q=deal+with+it+glasses+gif), we can resize, rotate, and move it relative to where the eyes are.  The image of the glasses can then be overlayed on the face by using masking.  

<p align="center">
<iframe src='https://gfycat.com/ifr/PowerfulAbandonedLamprey' frameborder='0' scrolling='no' width='600' height='332' allowfullscreen></iframe>
</p>

Although the glasses are supposed to drop, so I just added in that feature:

<p align="center">
<iframe src='https://gfycat.com/ifr/GregariousFarKid' frameborder='0' scrolling='no' width='600' height='332' allowfullscreen></iframe>
</p>

