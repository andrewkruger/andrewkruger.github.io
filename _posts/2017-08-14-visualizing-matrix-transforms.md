---
layout: post
title: "Visualizing Matrix Transforms"
author: andrew
tags: [blog]
description: >
---


## Matrix Transforms

The following is to demonstrate different types of matrix transformations that can be done to a data set or image.  For each of the following, if $$x\arrow$$ is the dataset (as a vector), and $$A$$ is the transformation matrix of $$T$$, then

$$
T = Ax
$$

In other words, $$A$$ is transforming $$x$$ to become $$T$$.  I'll apply matrix transformations to this circle and grid:

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/original.png?raw=true" alt="Field"/>
</p>

For each of the following, the blue will be the transformed image, green is the original.

## Scaling Matrix

A scaling matrix is a diagonal matrix where the diagonal elements (here $$v_x$$ and $$v_y$$) don't need to be one:

$$
S_v = \left( \begin{array}{cc}
v_x & 0 \\
0 & v_y \end{array} \right)\\
$$

For example, if we use $$v_x=1.2$$, it will make the image larger in the x-direction (because $$v_x>1$$), while $$v_y=0.6$$ will make it smaller in the y-direction (because $$v_y<1$$).

$$
S_v = \left( \begin{array}{cc}
1.2 & 0 \\
0 & 0.6 \end{array} \right)\\
$$

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/scale.png?raw=true" alt="Field"/>
</p>


## Rotation Matrix

A rotation matrix will rotate the data around the origin by an angle $$\theta$$, and follows:

$$
R(\theta) = \left( \begin{array}{cc}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta \end{array} \right)\\
$$

Here I rotate the image by a positive $$20^{\circ}$$.

$$
R(20^{\circ}) = \left( \begin{array}{cc}
\cos 20^{\circ} & -\sin 20^{\circ} \\
\sin 20^{\circ} & \cos 20^{\circ} \end{array} \right)\\
$$








$$
R(\theta) = \left( \begin{array}{cc}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta \end{array} \right)\\
$$