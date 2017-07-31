---
layout: project
title: "Neural Networks"
author: andrew
tags: [projects]
img: Movies.png
description: >
---


## Object Detection



## Convolutional Neural Networks

However, there is a major downside to training on images that have been pre-cropped and have the objects in a consistent position: the NN expects that the number should always be that size and in that position.  It's fast and easy to get a NN to correctly classify a number in an image using the MNIST dataset, but that model won't necessarily translate to detect numbers well in an arbitrary image.  A (poor) fix to this problem would be to scan images, cropping the image into boxes and seeing if a number is inside that box, but that's inefficient.

Instead, we can change the MNIST data so the numbers are no longered all centered, or the same size, or even tilted the same way.  This teaches the NN that the numbers don't have to be that size or specific position in the image, and makes it more robust in detecting numbers in non-conforming images.  (It will also expand the size of our training dataset, which is why this is called [*data augmentation*.](http://machinelearningmastery.com/image-augmentation-deep-learning-keras/))  While this will make the NN take longer to train, it will make it faster and better at detecting numbers in other images.

But then how is the NN detecting the numbers in larger images if it's not scanning them?  I'm glad you asked.  In simple terms, it's looking at the image in chunks, and only keeping the most interesting parts.  For exmaple
