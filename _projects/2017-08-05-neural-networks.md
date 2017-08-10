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



## Wide Networks?

The Keras example CNN for CIFAR 10 has four convolutional layers.  The first two have 32 filters, second two have 64 filters.  In creating a CNN for CIFAR 100, I initially attempted to increase accuracy by making it deeper with more hidden layers.  However, after grid searching different parameters such as learning rates adn decays, batch sizes, activation functions, etc., I was only able to get a maximum accuracy of 0.55 when adding two more layers.  

In searching through predictions for images, I tested various images of kangaroos and it was accurate on most of them, until I tested on a kangaroo that is grayer than the others:

<p align="center">
<img src="/public/img/cifar100/Kangaroo_gray.jpg?raw=true" alt="Gray Kangaroo"/>
</p>

Resized image for prediction:

<p align="center">
<img src="/public/img/cifar100/kangaroo_lowres.png?raw=true" alt="Low Resolution Kangaroo"/>
</p>

This image had the following predictions:

<p align="center">
<img src="/public/img/cifar100/kangaroo_elephant.png?raw=true" alt="Kangaroo Prediction"/>
</p>

This kangaroo was predicted to be an elephant.  It is similar in shape to other kangaroos that the model had recognized accurately, but only grayer in color.  This indicated a potential issue that the model was putting emphasis on color rather than shape, possibly due to the number of filters being used in the first layers.  

Different objects have similar structure elements (i.e. vertical/horizontal/slanted edges, colors, etc.), but 32 filters is not sufficient for the 100 different classes of objects.  I increased the first two layers from 32 to 128 filters, and the next two layers to 256, and the prediction for the image above changed to:

<p align="center">
<img src="/public/img/cifar100/kangaroo_kangaroo.png?raw=true" alt="Kangaroo Prediction"/>
</p>

Now the highest prediction is a kangaroo.  This shows that the while a deeper network enables it to recognize more complicated structures, it is absolutely necessary not to limit the number of structures that can be detected in the first place.
