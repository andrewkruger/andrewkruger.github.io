---
layout: post
title: "Pre-Trained Object Detection with YOLO"
author: andrew
tags: [blog]
description: >
---

There are pretrained neural networks that can be used localizing object recognition.  If you are doing a project where you need to detect an object that is already among the trained objects, it may be worth using these networks to test the project before training a more robust recognizer that meets your specific needs.

Below are images of objects that are recognized by a [*You Only Look Once* (YOLO)](https://pjreddie.com/darknet/yolo/) detector, done using the pre-trained network that comes with the downloaded files.

Original image:

<p align="center">
<img src="/public/img/trucks.jpg?raw=true" alt="Field" style="width:500px"/>
</p>

Localized detections:

<p align="center">
<img src="/public/img/predictions_trucks.png?raw=true" alt="Field" style="width:500px"/>
</p>


<br>
Original image:

<p align="center">
<img src="/public/img/bags.jpg?raw=true" alt="Field" style="width:500px"/>
</p>

Localized detections:

<p align="center">
<img src="/public/img/predictions_bags.png?raw=true" alt="Field" style="width:500px"/>
</p>
