---
layout: project
title: "Identifying Fake and Low-Quality Amazon Reviews"
author: andrew
tags: [projects]
img: amazon/project.png
description: >
---


### Welcome! This project write-up is currently in progress.


## Amazon Reviews

Amazon.com sells over 372 million products online (as of June 2017) and its online sales are so vast they affect store sales of other companies.  But they don't just affect the amount that is sold by stores, but also what people buy in stores.  It's a common habit of people to check Amazon reviews to see if they want to buy something in another store (or if Amazon is cheaper).  For this reason, it's important to companies that they maintain a postive rating on Amazon, leading to some companies to pay non-consumers to write positive "fake" reviews.


As a consumer, I have grown accustomed to reading reviews before making a final purchase decision, but have found it difficult to know when the reviews are possibly fake or not.  In the following, I use natural language processing to red flag reviewers who are potentially writing fake reviews, and products who may be paying for fake reviews.  (Please note, it's impossible to say with 100% certainty whether any of the following are actually fake reviews, so it should not be taken that I'm claiming as such.)


## Low-Quality Reviews

Looking at online resources that discuss what a typical fake review might look like ([howtogeek.com](https://www.howtogeek.com/282802/how-to-spot-fake-reviews-on-amazon-yelp-and-other-sites/),_____________), they are frequently:

1. brief
1. positive
1. uniformative
1. use generic words

This can also be descriptive of a review written by a top reviewer, but people who consistently write these low-quality reviews are more likely to be fake.  Further, products that have a higher rate of such reviews are more likely to be paying for reviews.  So detecting low-quality reviews would act as a first step in identifying fake reviews.


## Dataset

To create a model that can detect low-quality reviews, I obtained an Amazon review dataset on electronic products from [UC San Diego](http://jmcauley.ucsd.edu/data/amazon/).  The dataset contains 1,689,188 reviews from 192,403 reviewers across 63,001 products.  Most of the reviews are positive, with 60% of the ratings being 5-stars.

<p align="center">
<img src="/public/img/amazon/Star_Frequency.png?raw=true"/>
</p>

Looking at the number of reviews for each product, 50% of the reviews have at most 10 reviews.  The product with the most has 4,915 reviews.

<p align="center">
<img src="/public/img/amazon/Reviews_per_product.png?raw=true"/>
</p>

For the number of reviews per reviewer, 50% have at most 6 reviews, and the person with the most wrote 431 reviews.

<p align="center">
<img src="/public/img/amazon/Reviews_per_reviewer.png?raw=true"/>
</p>

## The Model

For each review, I used [TextBlob](http://textblob.readthedocs.io/en/dev/index.html) to do sentimental analysis of the review text.  The polarity is a measure of how positive or negative the words in the text are, with -1 being the most negative, +1 being most positive, and 0 being neutral.  This package also rates the subjectivity of the text, ranging from 0 being objective to +1 being the most subjective.

I then used a [count vectorizer](http://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html) count the number of times words are used in the texts, and removed words from the text that are either too rare (used in less than 2% of the reviews) or too common (used in over 80% of the reviews).  I then transformed the count vectors into a [term-frequency times inverse document-frequency (tf-idf) vector](http://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html), where the counts are given weights.  The tf-idf adds weight to words that are rare in a text but also rare when compared to all the texts, and reduces weight to common words in a text when they are also common in all the other texts.  This essentially adds importance to more unique words.

There are tens of thousands of words used in the reviews, so it is inefficient to fit a model all the words used.  Instead, dimensionality reduction can be performed with [Singular Value Decomposition (SVD)](http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html).  As I illustrated in [a blog post](https://andrewkruger.github.io/2017/08/14/visualizing-matrix-transforms/), the SVD can be used to find latent (hidden) relationships between the words.  The principal components are a combination of the words, and we can limit what components are being used by setting eigenvalues to zero.  I limited my model to 500 components.

Next, I used K-Means clustering to find clusters of review components.  A cluster would be a grouping of reviews in the word vector-space, where reviews on similar topics will be near each other.  This means a single cluster should represent a single topic.  The topic can be figured out by looking at the words that are most heavily used.  For example, clusters with the following words were found, leading to the suggested topics:

*speaker, bass, sound, volume, portable, audio, high, quality, music..*. = Speakers

*scroll, wheel, logitech, mouse, accessory, thumb...* = Computer Mouse

*usb, port, power, plugged, device, cable, adapter, switch...* = Cables

*hard, drive, data, speed, external, usb, files, fast, portable...* = Hard Drives

*camera, lens, light, image, manual, canon, hand, taking, point...* = Cameras

The topic cluster had the three most important factors being high stars, high polarity, high subjectivity, and words such as *perfect, great, love, excellent, product*.  



Rather than modeling on the entire dataset (which would be very data-heavy), I broke down into 200 groups.  





# Ignore this, I'm testing formatting...


But it's not just fake reviews that interfere with decision making.  People that give a star rating but don't give any explanation of anything about the product, how it worked, or the quality, are simply changing the rating without adding information. 



But it's not just fake reviews that interfere with decision making, people that give high stars but don't give a good explanation of anything about the product



Here are some examples of reviews in this cluster:

This produce is well made is from a good company and works as stated very well.  This item came in a very short timne and was all I had expected

This is the best batery for your casi.... do not try anything else.... you will regreat.

great and on time and good cord got before Christmas and did not have to drive any were or fight traffic

awesome stuff,,,,this is the best there is.  if u need thermal paste this is the stuff to get! great stuff! !

good quality and price. recommended.




https://www.amazon.com/gp/profile/amzn1.account.AEPL3VBEKQBLHUBGKX76BG72MZEQ