---
layout: project
title: "Identifying Low-Quality and Potentially Fake Amazon Reviews"
author: andrew
tags: [projects]
img: amazon/project.png
description: >
---


### Welcome! This project write-up is currently in progress.

<br>
## Amazon Reviews

Amazon.com sells over 372 million products online (as of June 2017) and its online sales are so vast they affect store sales of other companies.  But they don't just affect the amount that is sold by stores, but also what people buy in stores.  It's a common habit of people to check Amazon reviews to see if they want to buy something in another store (or if Amazon is cheaper).  For this reason, it's important to companies that they maintain a postive rating on Amazon, leading to some companies to pay non-consumers to write positive "fake" reviews.  As a consumer, I have grown accustomed to reading reviews before making a final purchase decision, so my decisions are possibly being influenced by non-consumers.  

Another barrier to making an informed decision is the quality of the reviews.  While more popular products will have many reviews that are several paragraphs of thorough discussion, most people are not willing to spend the time to write such lengthy reviews.  This often means less popular products could have reviews with less information.  While they still have a star rating, it's hard to know how accurate that rating is without more informative reviews. 

In reading about what clues can be used to identify fake reviews, I found may online resources say they are more likely to be generic and uninformative.  This brings to mind several questions.  Can low-quality reviews be used to potentially find fake reviews?  Are products with mostly low-quality reviews more likely to be purchasing fake reviews?  Can we identify people who are writing the fake reviews based on their quality?

Here I will be using natural language processing to categorize and analyze Amazon reviews to see if and how low-quality reviews could potentially act as a tracer for fake reviews.


<br>
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

<br>
## The Model

For each review, I used [TextBlob](http://textblob.readthedocs.io/en/dev/index.html) to do sentiment analysis of the review text.  The polarity is a measure of how positive or negative the words in the text are, with -1 being the most negative, +1 being most positive, and 0 being neutral.  This package also rates the subjectivity of the text, ranging from 0 being objective to +1 being the most subjective.

I then used a [count vectorizer](http://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html) count the number of times words are used in the texts, and removed words from the text that are either too rare (used in less than 2% of the reviews) or too common (used in over 80% of the reviews).  I then transformed the count vectors into a [*term frequency-inverse document frequency* (tf-idf) vector](http://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html).  A *term frequency* is the simply the count of how many times a word is in the review text.  The term frequency can be normalized by dividing by the total number of words in the text.  The *inverse document frequency* is a weighting that depends on how frequently a word is found in all the reviews.  It follows the relationship $$log \frac{N}{d}$$ where $$N$$ is the total number of reviews and $$d$$ is the number of reviews (documents) that have a specific word in it.  If a word is more rare, this relationship gets larger, so the weighting on that word gets larger.  The tf-idf is a combination of these two frequencies.  This means if a word is rare in a specific review, tf-idf gets smaller because of the term frequency - but if that word is rarely found in the other reviews, the tf-idf gets larger because if the inverse document frequency.  Likewise, if a word is found a lot in a review, the tf-idf is larger because of the term frequency - but if it's also found most all reviews, the tf-idf gets small because of the inverse document frequency.  In this way it highlights unique words.

There are tens of thousands of words used in the reviews, so it is inefficient to fit a model all the words used.  Instead, dimensionality reduction can be performed with [Singular Value Decomposition (SVD)](http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html).  As I illustrate in [a more detailed blog post](https://andrewkruger.github.io/2017/08/14/visualizing-matrix-transforms/), the SVD can be used to find latent relationships between features (words).  The principal components are a combination of the words, and we can limit what components are being used by setting eigenvalues to zero.  I limited my model to 500 components.

Next, I used K-Means clustering to find clusters of review components.  A cluster is be a grouping of reviews in the latent feature vector-space, where reviews with similarly weighted features will be near each other.  This means a single cluster should represent a topic.  The specific topic can be figured out by looking at the words that are most heavily weighted.  For example, clusters with the following words were found, leading to the suggested topics:

*speaker, bass, sound, volume, portable, audio, high, quality, music..*. = **Speakers**

*scroll, wheel, logitech, mouse, accessory, thumb...* = **Computer Mouse**

*usb, port, power, plugged, device, cable, adapter, switch...* = **Cables**

*hard, drive, data, speed, external, usb, files, fast, portable...* = **Hard Drives**

*camera, lens, light, image, manual, canon, hand, taking, point...* = **Cameras**

Other topics were more ambiguous.  For example, one cluster had words such as:

*something, more, than, what, say, expected...*

Reading the examples showed phrases commonly used in reviews such as "This is something I...", "It worked as expected", and "What more can I say?".  So these types of clusters included less descript reviews that had common phrases.

When modeling the data, I separated the reviews into 200 smaller groups (just over 8,000 reviews in each) and fit the model to each of those subsets.  These types of *common phrase* groups were not very predictable in what words were emphasized.  But one cluster for generic reviews remained consistent between review groups that had the three most important factors being a high star rating, high polarity, high subjectivity, and words such as *perfect, great, love, excellent, product*.  The reviews from this topic, which I'll call the **low-quality** topic cluster, had exactly the qualities listed above that were expected for fake reviews.  I used this as the target topic that would be used to find potential fake reviewers and the products that used fake reviews.


## Potential Fake Reviews

I modeled each review in the dataset, and for each product and reviewer, I found what percentage of their reviews were in the low-quality topic.  These are plotted here vs. the number of reviews written for each person in the dataset:

<p align="center">
<img src="/public/img/amazon/Low_Quality_Reviewers.png?raw=true"/>
</p>

There are 13 reviewers that have 100% low-quality, all of which wrote a total of 5 reviews.  It's not surprising that people who write more reviews are less likely to have a high percentage of low-quality reviews.

Here I do the same for each product to find which products may have fake reviews.

<p align="center">
<img src="/public/img/amazon/Low_Quality_Products.png?raw=true"/>
</p>

The peak is at 2/3 of the reviews being low-quality, for which there are four products, each with a total of six reviews.  The


One possible (or maybe likely) reason people do so many reviews at once with no reviews for long periods of time is they simply don't write the reviews as they buy things.  The list of products in their order history builds up, and they do all the reviews at once.



https://www.amazon.com/gp/profile/amzn1.account.AEPL3VBEKQBLHUBGKX76BG72MZEQ



## Potential Remedy

By identifying low-quality reviews, I found that many people will write a large number of reviews at the same time, frequently giving 5 stars and using the same generic comment repeatedly to save time.  These are important to demonstrate that people are happy with the product even if they don't want to spend the time to write reviews.  However, by indiscriminantly giving 5 stars, it 




