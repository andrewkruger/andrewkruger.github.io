---
layout: project
title: "Keras Convolutional Neural Network and CIFAR 100"
author: andrew
tags: [projects]
img: cifar100/Kangaroo_gray.jpg
description: >
---


## CIFAR-10 and -100


The [CIFAR-10 and CIFAR-100 datasets](https://www.cs.toronto.edu/~kriz/cifar.html) consist of 32x32 pixel images in 10 and 100 classes, respectively.  Both datasets have 50,000 training images and 10,000 testing images.  The [github repo for Keras](https://github.com/fchollet/keras) has an [example Convolutional Neural Network (CNN) for CIFAR-10](https://github.com/fchollet/keras/blob/master/examples/cifar10_cnn.py) that has ____________.  




<br>

## Convolutional Neural Networks

However, there is a major downside to training on images that have been pre-cropped and have the objects in a consistent position: the NN expects that the number should always be that size and in that position.  It's fast and easy to get a NN to correctly classify a number in an image using the MNIST dataset, but that model won't necessarily translate to detect numbers well in an arbitrary image.  A (poor) fix to this problem would be to scan images, cropping the image into boxes and seeing if a number is inside that box, but that's inefficient.

Instead, we can change the MNIST data so the numbers are no longered all centered, or the same size, or even tilted the same way.  This teaches the NN that the numbers don't have to be that size or specific position in the image, and makes it more robust in detecting numbers in non-conforming images.  (It will also expand the size of our training dataset, which is why this is called [*data augmentation*.](http://machinelearningmastery.com/image-augmentation-deep-learning-keras/))  While this will make the NN take longer to train, it will make it faster and better at detecting numbers in other images.


<br>

## The Model

An Exponential Linear Unit (ELUs) is an activation function that has been shown to help speed up the learning and return high accuracy of a NN, specifically on the CIFAR 100 dataset ([Clevert et al. 2015](https://arxiv.org/pdf/1511.07289.pdf)).  The CNNs used in the paper are deep, with up to 18 convolutional layers.

$$
f(x)=\begin{cases}
1, & \text{if $x<0$}.\\
0, & \text{otherwise}.
\end{cases}
$$



## Flask and D3 App


I made a basic app that takes in an online image and use the CNN model to predict what the image was.  It used [Flask](http://flask.pocoo.org/), which is used to make python-based webpages, and [D3](https://d3js.org/), a JavaScript library used to create visuals.  After inputting the URL of the image, it returns a graph showing the probabilities of the top five predictions.  ([Higher-resolution on YouTube](https://www.youtube.com/watch?v=oLxNxCC-G6Q&feature=youtu.be)).

<p align="center">
<iframe src='https://gfycat.com/ifr/LikelyAdorableKronosaurus' frameborder='0' scrolling='no' width='600' height='375' allowfullscreen></iframe>
</p>

The image used:

<p align="center">
<img src="https://s3-eu-west-1.amazonaws.com/mordhau-media/spirit/images/895/23b4c00e4779c04235bd338bb997b4a9.jpeg" alt="Castle and Bridge"/>
</p>

The prediction:

<p align="center">
<img src="/public/img/cifar100/bridge_castle_prediction.png?raw=true" alt="Bridge Castle Prediction" style="width:500px"/>
</p>

Although the model was trained to recognize images of single objects, it was able to recognize both the bridge and the castle.

<br>

## Wide Neural Networks?

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

Different objects have similar structure elements (i.e. vertical/horizontal/slanted edges, colors, etc.), but 32 filters is not sufficient for the 100 different classes of objects.  I increased the first two layers from 32 to 128 filters, and the next two layers from 64 to 256, and the prediction for the image above changed to:

<p align="center">
<img src="/public/img/cifar100/kangaroo_kangaroo.png?raw=true" alt="Kangaroo Prediction"/>
</p>

Now the highest prediction is a kangaroo.  This shows that the while a deeper network enables it to recognize more complicated structures, it's necessary not to limit the number of structures that can be used.



