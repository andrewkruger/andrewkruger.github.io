---
layout: post
title: "TensorFlow, MNIST, and AWS"
author: andrew
tags: [blog]
description: >
---

The following shows how to get TensorFlow set up and training on the MNIST dataset.

I want to run a Convolutional Neural Network on an AWS g2.2xlarge instance, but the default limit is 0.  I had to submit a request to get a service limit increase [as described on stackoverflow](https://stackoverflow.com/questions/43122433/failure-to-launch-amazon-ec2-non-free-instances).  It was approved fast, but takes up to 30 minutes for the GPU to become available.

Launch a new Amazon EC2 instance, and in the "Community AMIS" tab, search for *udacity-dl*.  Use the drop-down menu that says "All instance types" and pick *GPU Instances*.  I changed the Size to 100GiB and gave it a key name.  

Install numpy and tensorflow.

~~~sh
    sudo pip3 install --upgrade pip
    sudo pip3 install numpy
    sudo apt-get install libcupti-dev
    sudo pip3 install --upgrade tensorflow-gpu
~~~

Download the MNIST CNN example:

~~~sh
    wget "https://raw.githubusercontent.com/tensorflow/tensorflow/r1.2/tensorflow/examples/tutorials/layers/cnn_mnist.py"
~~~


