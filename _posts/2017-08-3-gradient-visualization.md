---
layout: post
title: "Visualizing Gradients with Quiver"
author: andrew
tags: [blog]
description: >
---


A gradient is used to find the slope of a multi-dimensional field by the relationship

$$
\nabla F = \frac{\partial F}{\partial x} \hat{x} + \frac{\partial F}{\partial y} \hat{y} + \frac{\partial F}{\partial z} \hat{z}
$$

Slopes (derivatives) in one dimension are easily shown on a plot, where the sign of the values shows the direction, but this doesn't work in multiple dimensions.  In 2-dimensions, slopes can be visualized as a vector field with vectors pointing in the direction of "up" with a length proportional to the magnitude of the slope.

Let's create a field following the function $$f(x,y) = x^2 - y^2$$.
