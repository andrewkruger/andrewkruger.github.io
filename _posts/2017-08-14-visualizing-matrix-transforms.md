---
layout: post
title: "Visualizing Matrix Transforms"
author: andrew
tags: [blog]
description: >
---


## Matrix Transforms

The following is to demonstrate different types of matrix transformations that can be done to a data set or image.  For each of the following, if $$x$$ is the dataset (as a vector), and $$A$$ is the transformation matrix of $$T$$, then

$$
T = Ax
$$

In other words, $$A$$ is transforming $$x$$ to become $$T$$.  I'll apply matrix transformations to this circle and grid:

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/original.png?raw=true" alt="Field" style="width:300px"/>
</p>

For each of the following, the blue will be the transformed image, green is the original.

<br>
## Scaling Matrix

A scaling matrix is a diagonal matrix where the diagonal elements (here $$v_x$$ and $$v_y$$) don't need to be one:

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/scale_matrix.png?raw=true" />
</p>

For example, if we use $$v_x=1.2$$, it will make the image larger in the x-direction (because $$v_x>1$$), while $$v_y=0.6$$ will make it smaller in the y-direction (because $$v_y<1$$).

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/scale_ex.png?raw=true"/>
<img src="/public/img/visualizing_matrix_transforms/scale.png?raw=true" />
</p>

<br>
## Rotation Matrix

A rotation matrix will rotate the data *around the origin* by an angle $$\theta$$, and follows:

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/rotation_matrix.png?raw=true"/>
</p>

Here I rotate the image by a positive $$20^{\circ}$$.  Notice that it rotates counter-clockwise.

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/rotation_ex.png?raw=true"/>
<img src="/public/img/visualizing_matrix_transforms/rotate.png?raw=true"/>
</p>

<br>
## Shear Matrix

A shear matrix will basically tilt an axis by having a non-zero, off-axis element.

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/shear_matrix.png?raw=true"/>
</p>

The larger the $$\lambda$$, the greater the shear.

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/shear1_ex.png?raw=true" />
<img src="/public/img/visualizing_matrix_transforms/shear1.png?raw=true" />
</p>


<p align="center">
<img src="/public/img/visualizing_matrix_transforms/shear2_ex.png?raw=true"/>
<img src="/public/img/visualizing_matrix_transforms/shear2.png?raw=true"/>
</p>

<br>
## Skew-symmetric Matrix

The skew matrix will shear the axes the same amount but in opposite directions.  A skew matrix will not rotate the data, but will shear the axis the same angle in opposite directions.  This does the same as the scaling matrix, but instead of scaling along the axes, it scales at an angle.

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/skew_matrix.png?raw=true"/>
</p>

The angle $$\theta$$ does not determine the angle of the skew, but the amount of skew.

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/skew10_ex.png?raw=true"/>
<img src="/public/img/visualizing_matrix_transforms/skew10.png?raw=true"/>
</p>

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/skew20_ex.png?raw=true"/>
<img src="/public/img/visualizing_matrix_transforms/skew20.png?raw=true"/>
</p>

<br>
## Multiple Transformations

A transformation can be the combination of transformations.  For example, a skew-symmetric matrix can be replaced by a combination of a rotation-scale-derotation:

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/skew_combo.png?raw=true"/>
</p>

This can be understood visually by the image being rotated, scaled along the x- and y-axes, then rotated back so the scaling appears as a skew.  (Or, tilt your head when looking at the skew images, it's just like a scaled image but at an angle.)  But mathetmatically, [since the skew-symmetric matrix is symmetric, it means it can be described by the relationship](http://mathworld.wolfram.com/SymmetricMatrix.html):

<p align="center">
<img src="/public/img/visualizing_matrix_transforms/symmetric_matrix.png?raw=true"/>
</p>

where $$Q$$ is an orthogonal matrix ($$Q=-Q^T$$) and $$D$$ is a diagonal matrix.  Notice that the rotation matrix is orthogonal (and $$R(-\theta) = R(\theta)^T$$) and the scaling matrix is diagonal.  

Another way to think of it is the matrix $$D$$ is the diagonalization of $$A$$.  The magnitude that $$D$$ scales the image is the same as $$A$$, but the axes of $$D$$ are just aligned with the direction $$A$$ scales it.  Those directions that $$A$$ scale, and that the elements $$D$$ are aligned in, are the *principal axes*.  This brings us to *principal components*.



<br>
## Principal Components

A covariance matrix shows the covariance of two vector elements in a dataset.  The covariance of the $$i$$ and $$j$$ elements is the same as the covariance of the $$j$$ and $$i$$ elements (order doesn't matter).  This means the i,j component of the covariance matrix are the same as the j,i component, so the covariance matrix is symmetric.  

The covariance matrix is 
